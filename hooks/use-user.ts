"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function useUser() {
  const router = useRouter();
  const [user, setUser] = useState<{
    isAuthenticated: boolean;
    isAdmin: boolean;
  } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/user");
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  return {
    user,
    isAdmin: user?.isAdmin ?? false,
    isAuthenticated: user?.isAuthenticated ?? false,
    mutate: fetchUser,
  };
}
