"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "@/lib/auth/config";
import { NextRequest, NextResponse } from "next/server";

// helper function for getting the current session
export async function getSession(req?: NextRequest, res?: NextResponse) {
  const session =
    req && res
      ? await getIronSession<SessionData>(req, res, sessionOptions)
      : await getIronSession<SessionData>(await cookies(), sessionOptions);

  // For security, you can double-check the user's existence in the database or AD server, but this slows down the app.
  return session;
}

export async function createSession(user: SessionData) {
  const session = await getSession();

  // Store user data in the cookie by mapping over each of the object's property
  Object.entries(user).forEach(([key, value]) => {
    if (!(key in session)) {
      (session as any)[key] = value;
    }
  });

  await session.save();
}

export async function getSessionOnClient(): Promise<SessionData> {
  const { user, isAuthenticated, isAdmin } = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  return {
    user,
    isAuthenticated,
    isAdmin,
  };
}
