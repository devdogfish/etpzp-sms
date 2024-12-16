"use client";
import React, { useEffect } from "react";

export default function UnloadListener() {
  useEffect(() => {
    const handleBeforeUnload = (event: Event) => {
      const message =
        "You have unsaved changes. Are you sure you want to leave this page?";
      event.preventDefault();
      event.returnValue = !!message; // For most browsers
      return message; // For some older browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return <></>;
}
