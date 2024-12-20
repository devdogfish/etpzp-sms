"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { defaultSession, SessionData, sessionOptions } from "@/lib/auth.config";
import { NextRequest, NextResponse } from "next/server";

// helper function for getting the current session
export async function getSession(req?: NextRequest, res?: NextResponse) {
  const session =
    req && res
      ? await getIronSession<SessionData>(req, res, sessionOptions)
      : await getIronSession<SessionData>(await cookies(), sessionOptions);

  // If user visits for the first time session returns an empty object.
  // You could check for user in the database, or check server. If he got blocked or something, the user should get kicked out immediately
  return session;
}

export async function createSession(user: SessionData) {
  const session = await getSession();
  console.log(`Creating session ${session}`);

  Object.entries(user).forEach(([key, value]) => {
    if (!(key in session)) {
      (session as any)[key] = value;
    }
  });

  await session.save();
  console.log(`Session saved ${session}`);
}

export async function updateSession() {
  console.log("Updating session...");
}

export async function getSessionOnClient() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  const { isAuthenticated, isAdmin, username, id } = session;
  return {
    isAuthenticated,
    isAdmin,
    username,
    id,
  };
}
