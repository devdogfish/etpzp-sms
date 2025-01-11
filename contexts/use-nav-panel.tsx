"use client";
import React, { createContext, Dispatch, useContext, useState } from "react";

const NavPanelContext = createContext<{
  isExpanded: boolean;
  setIsExpanded: Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export function NavPanelProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <NavPanelContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </NavPanelContext.Provider>
  );
}
export function useNavPanel() {
  const context = useContext(NavPanelContext);
  if (!context) {
    throw new Error("NavPanelContext must be within NavPanelProvider");
  }
  return context;
}
