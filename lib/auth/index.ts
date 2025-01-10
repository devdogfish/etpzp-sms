"use server";

import authenticate, {
  dummyAuthenticate,
} from "./activedirectory/authenticate";
import { createSession, getSession } from "./sessions";
import { LoginSchema } from "@/lib/form.schemas";
import { Login, SessionData } from "../auth.config";
import { ActionResponse } from "@/types/action";

// This function is for actually authenticating the user and fetching all the users data
// Once the data is fetched we save it to the session using createSession()
export async function login(
  _: ActionResponse<Login> | null,
  formData: FormData
): Promise<ActionResponse<Login>> {
  // 1. Type validation
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const validatedData = LoginSchema.safeParse({ username, password });
  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid value types. Try again",
      inputs: { username, password },
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  console.log("\n");
  console.log("\n");
  console.log("STARTING AUTHENTICATION");
  console.log(username, password);

  // Authenticate the user by checking his credentials
  // const user: SessionData & { errors: string[] } = await authenticate({
  //   username,
  //   password,
  // });

  const user: SessionData = await authenticate({
    username,
    password,
  });

  if (!user.isAuthenticated) {
    console.log("Wrong credentials!");

    return {
      success: false,
      message: "Wrong credentials! Try again",
      inputs: { username, password },
    };
  }

  // I need to think about how I will return different errors, because it is hard to access them in this file.
  // if (user.errors.find((i: any) => i !== "")) {
  //   return { success: false, error: "Wrong credentials. Try again" };
  // }

  // If everything went well create a new session and redirect user to dashboard
  await createSession(user);
  return { success: true, message: "User authenticated successfully" };
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  return { success: true };
}
