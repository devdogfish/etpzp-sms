"use server";

import authenticate, {
  dummyAuthenticate,
} from "./activedirectory/authenticate";
import { createSession, getSession } from "./sessions";
import { LoginSchema } from "@/lib/form.schemas";
import { Login, SessionData } from "./config";
import { ActionResponse } from "@/types/action";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

// This function is for actually authenticating the user and fetching all the users data
// Once the data is fetched we save it to the session using createSession()
export async function login(
  _: ActionResponse<Login> | null,
  formData: FormData
): Promise<ActionResponse<Login>> {
  // 1. Type validation
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedData = LoginSchema.safeParse({ email, password });
  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid value types. Try again",
      inputs: { email, password },
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  console.log("\n");
  console.log("\n");
  console.log("STARTING AUTHENTICATION");
  console.log(email, password);

  const user: SessionData /**& { errors: string[] } */ = await authenticate({
    email,
    password,
  });

  if (!user.isAuthenticated) {
    console.log("Wrong credentials!");

    return {
      success: false,
      message: "Wrong credentials! Try again",
      inputs: { email, password },
    };
  }

  // If everything went well create a new session and redirect user to dashboard
  await createSession(user);
  redirect("/");
}

export async function logout() {
  const session = await getSession();
  session.destroy();

  return { success: true };
}
