"use client";

import { SessionData } from "@/lib/auth/config";
import { getSessionOnClient } from "@/lib/auth/sessions";
import { useState, useEffect } from "react";

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const data = await getSessionOnClient();
        // console.log(data);

        setSession(data);
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, []);

  return { session, loading };
}
