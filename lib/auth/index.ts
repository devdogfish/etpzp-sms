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
  console.log("loggin you in HERE");
  // Check if the user session is authenticated if not check the server
  // const user: SessionData & { errors: string[] } = await authenticate({
  //   username,
  //   password,
  // });
  console.log(username, password);

  const user: SessionData = await dummyAuthenticate({
    username,
    password,
  });

  if (!user.isAuthenticated) {
    console.log("wrong credentials");

    return { success: false, error: "Wrong credentials. Try again" };
  }


  // I need to think about how I will return different errors, because it is hard to access them in this file.
  // if (user.errors.find((i: any) => i !== "")) {
  //   return { success: false, error: "Wrong credentials. Try again" };
  // }
console.log(`Creating Session ${user}`);

  // create the session using the returned sessionData
  await createSession(user);

  redirect("/");
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/");
}
