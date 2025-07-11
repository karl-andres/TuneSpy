import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email("Invalid email"),
  password: z.string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters"),
});

export const signInSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email("Email invalid"),
  password: z.string({ required_error: "Password is required" }),
});

export const songInputSchema = z.object({
  audio_file: z.instanceof(File).refine(
    (file) => ["audio/wav", "audio/mp3"].includes(file.type),
    { message: "Invalid audio file type. Only MP3 and WAV are supported." },
  ),
  use_large_vocabulary: z.enum(["true", "false"]),
});

export const chordDataSchema = z.object({
  start: z.number(),
  end: z.number(),
  chord: z.string(),
})

export const labDataSchema = z.object({
  lab_data: z.array(chordDataSchema),
})

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
})

export const successResponseSchema = z.object({
  success: z.literal(true),
  data: labDataSchema
})

export const chordsResponseSchema = z.union([
  errorResponseSchema,
  successResponseSchema
])