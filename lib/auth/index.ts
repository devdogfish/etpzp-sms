"use server";

import authenticate, {
  dummyAuthenticate,
} from "./activedirectory/authenticate";
import { createSession, getSession } from "./sessions";
import { LoginSchema } from "@/lib/form.schemas";
import { Login, SessionData } from "./config";
import { ActionResponse } from "@/types/action";

export async function login(
  formData: FormData
): Promise<ActionResponse<Login>> {
  // 1. Type validation
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedData = LoginSchema.safeParse({ email, password });
  if (!validatedData.success) {
    return {
      success: false,
      message: ["common:fix_zod_errors"],
      inputs: { email, password },
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  // 2. Authenticate user using AD and save to db
  const user: SessionData = await dummyAuthenticate({
    email,
    password,
  });

  if (!user.isAuthenticated) {
    return {
      success: false,
      message: ["server-wrong_credentials"],
      inputs: { email, password },
    };
  }

  // 3. Create new session cookie
  await createSession(user);
  return {
    success: true,
    message: [
      "server-auth_success_header",
      "server-auth_success_header_caption",
    ],
  };
}

export async function logout() {
  try {
    const session = await getSession();
    session.destroy();
    return { success: true };
  } catch (error) {
    console.log("LOGOUT FAILED:", error);

    return { success: false };
  }
}
