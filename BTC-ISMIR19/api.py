from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import FileResponse
import os
import tempfile
import shutil
import uvicorn
import numpy as np
from test import (
    BTC_model, 
    HParams, 
    audio_file_to_features, 
    idx2chord, 
    idx2voca_chord,
    torch,
    device
)
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Chord Recognition API",
    description="API for recognizing chords in audio files using BTC model",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/recognize-chords/")
async def recognize_chords(
    audio_file: UploadFile = File(...),
    use_large_vocabulary: str = Form("false")
):
    """
    Recognize chords in an uploaded audio file.
    Args:
        audio_file: The audio file to process (WAV or MP3)
        use_large_vocabulary: Whether to use the large vocabulary model
    Returns:
        Dictionary containing chord label intervals (lab_data)
    """
    # Load config fresh each request (or cache if needed)
    config = HParams.load("run_config.yaml")
    print(f"Large vocabulary flag: {use_large_vocabulary}")

    # Select model parameters and files based on flag
    if use_large_vocabulary == "true":
        config.feature['large_voca'] = True
        config.model['num_chords'] = 170
        model_file = './test/btc_model_large_voca.pt'
        idx_to_chord = idx2voca_chord()
    else:
        model_file = './test/btc_model.pt'
        idx_to_chord = idx2chord

    # Initialize model and load weights
    model = BTC_model(config=config.model).to(device)
    if not os.path.isfile(model_file):
        raise HTTPException(status_code=500, detail=f"Model file not found: {model_file}")
    checkpoint = torch.load(model_file, weights_only=False, map_location=torch.device('cpu'))
    mean = checkpoint['mean']
    std = checkpoint['std']
    model.load_state_dict(checkpoint['model'])

    # Create temp directory to store uploaded audio file
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_audio_path = os.path.join(temp_dir, audio_file.filename)
        with open(temp_audio_path, "wb") as buffer:
            shutil.copyfileobj(audio_file.file, buffer)

        # Feature extraction
        feature, feature_per_second, song_length_second = audio_file_to_features(temp_audio_path, config)

        # Prepare input for model
        feature = feature.T
        feature = (feature - mean) / std
        time_unit = feature_per_second
        n_timestep = config.model['timestep']

        num_pad = n_timestep - (feature.shape[0] % n_timestep)
        feature = np.pad(feature, ((0, num_pad), (0, 0)), mode="constant", constant_values=0)
        num_instance = feature.shape[0] // n_timestep

        # Run model inference
        start_time = 0.0
        lines = []
        with torch.no_grad():
            model.eval()
            feature_tensor = torch.tensor(feature, dtype=torch.float32).unsqueeze(0).to(device)
            for t in range(num_instance):
                self_attn_output, _ = model.self_attn_layers(feature_tensor[:, n_timestep * t:n_timestep * (t + 1), :])
                prediction, _ = model.output_layer(self_attn_output)
                prediction = prediction.squeeze()
                for i in range(n_timestep):
                    if t == 0 and i == 0:
                        prev_chord = prediction[i].item()
                        continue
                    if prediction[i].item() != prev_chord:
                        lines.append(
                            '%.3f %.3f %s\n' % (start_time, time_unit * (n_timestep * t + i), idx_to_chord[prev_chord])
                        )
                        start_time = time_unit * (n_timestep * t + i)
                        prev_chord = prediction[i].item()
                    if t == num_instance - 1 and i + num_pad == n_timestep:
                        if start_time != time_unit * (n_timestep * t + i):
                            lines.append(
                                '%.3f %.3f %s\n' % (start_time, time_unit * (n_timestep * t + i), idx_to_chord[prev_chord])
                            )
                        break

        # Save lab file to temp dir (optional if want to keep for debugging)
        lab_path = os.path.join(temp_dir, "output.lab")
        with open(lab_path, 'w') as f:
            f.writelines(lines)

        # Prepare lab data to return
        lab_data = []
        for line in lines:
            parts = line.strip().split()
            if len(parts) == 3:
                start, end, chord = parts
                lab_data.append({
                    "start": float(start),
                    "end": float(end),
                    "chord": chord
                })

        return {
            "lab_data": lab_data,
        }

# Uncomment to run server standalone
# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)
