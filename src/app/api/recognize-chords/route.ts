import { NextResponse } from "next/server";
import { songInputSchema, labDataSchema } from "~/schemas";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function POST(req: Request): Promise<Response> {
  const formData = await req.formData();

  try {
    const { audio_file, use_large_vocabulary } = await songInputSchema.parseAsync({
      audio_file: formData.get("audio_file"),
      use_large_vocabulary: formData.get("use_large_vocabulary"),
    });

    const apiFormData = new FormData();
    apiFormData.append("audio_file", audio_file);
    apiFormData.append("use_large_vocabulary", use_large_vocabulary);

    const response = await fetch("http://127.0.0.1:8000/recognize-chords/", {
      method: "POST",
      body: apiFormData,
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: "Failed to process audio file" }, { status: 500 });
    }

    const jsonData = await response.json();
    const data = labDataSchema.parse(jsonData)

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    await db.song.create({
      data: {
        title: audio_file.name.replace(/\.[^/.]+$/, ""),
        labData: JSON.stringify(data.lab_data),
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 400 });
  }
}
