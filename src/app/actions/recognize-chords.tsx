'use server';

import { ZodError } from "zod";
import { songInputSchema } from "~/schemas";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

interface ChordData {
  start: number;
  end: number;
  chord: string;
}

interface ApiResponse {
  lab_data: ChordData[];
}

export async function recognizeChords(prevState: string | undefined, formData: FormData): Promise<{
  success: boolean;
  data?: ApiResponse;
  error?: string;
}> {
  try {
    const { audio_file, use_large_vocabulary } = await songInputSchema.parseAsync({
      audio_file: formData.get("audio_file"),
      use_large_vocabulary: formData.get("use_large_vocabulary"),
    });

    const apiFormData = new FormData();
    apiFormData.append("audio_file", audio_file);
    apiFormData.append("use_large_vocabulary", String(use_large_vocabulary));

    const response = await fetch("http://127.0.0.1:8000/recognize-chords/", {
      method: "POST",
      body: apiFormData,
    });

    if (!response.ok) {
      return { success: false, error: "Failed to process audio file" };
    }

    const data: ApiResponse = await response.json();

    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    await db.song.create({
      data: {
        title: audio_file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for title. filename.wav -> filename
        labData: JSON.stringify(data.lab_data),
        userId: session.user.id,
      },
    });

    return { success: true, data };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
