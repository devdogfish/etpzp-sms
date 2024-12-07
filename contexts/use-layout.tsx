
"use client"
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface LayoutContextType {
  layout: number[];
  setLayout: Dispatch<SetStateAction<number[]>>;
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}
const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({
  children,
  initialLayout,
  initialIsCollapsed,
}: {
  children: React.ReactNode;
  initialLayout: number[];
  initialIsCollapsed: boolean;
}) {
  const [layout, setLayout] = useState(initialLayout);
  const [isCollapsed, setIsCollapsed] = useState(initialIsCollapsed);

  return (
    <LayoutContext.Provider value={{ layout, setLayout, isCollapsed, setIsCollapsed }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
