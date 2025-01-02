"use server";

import { z } from "zod";
import authenticate, {
  dummyAuthenticate,
} from "./activedirectory/authenticate";
import { createSession, getSession } from "./sessions";
import { AuthFormSchema } from "@/lib/form.schemas";
import { redirect } from "next/navigation";
import { SessionData } from "../auth.config";

// This function is for actually authenticating the user and fetching all the users data
// Once the data is fetched we save it to the session using createSession()
export async function login({
  username,
  password,
}: z.infer<typeof AuthFormSchema>) {
  // Authenticate the user by checking his credentials
  // const user: SessionData & { errors: string[] } = await authenticate({
  //   username,
  //   password,
  // });

  const user: SessionData = await dummyAuthenticate({
    username,
    password,
  });

  if (!user.isAuthenticated) {
    console.log("Wrong credentials!");

    return { success: false, error: "Wrong credentials. Try again" };
  }

  // I need to think about how I will return different errors, because it is hard to access them in this file.
  // if (user.errors.find((i: any) => i !== "")) {
  //   return { success: false, error: "Wrong credentials. Try again" };
  // }

  // If everything went well create a new session and redirect user to dashboard
  await createSession(user);
  return { success: true, error: null };
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/");
}
