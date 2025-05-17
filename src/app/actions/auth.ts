"use server";

import { ZodError } from "zod";
import { db } from "~/server/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { signUpSchema } from "~/schemas";

export async function register(
  prevState: string | undefined, 
  formData: FormData
) {
  try {
    const { email, password } = await signUpSchema.parseAsync({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
        return "User already exists";
    }

    const hash = await bcrypt.hash(password, 10);

    await db.user.create({
     data: {
        email: email,
        password: hash,
     },
    });

  } catch (error) {
     if (error instanceof ZodError) {
        return error.issues.map((issue) => issue.message).join(", ")
     }
  }
  redirect("/signin")
}