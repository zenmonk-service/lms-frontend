"use server";
import { signIn } from "./auth";

export async function authenticate(data: { email: string; name: string }) {
  return await signIn("credentials", {
    redirect: false,
    email: data.email,
    name: data.name,
  });
}

