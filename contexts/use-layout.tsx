"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type LayoutContextType = {
  layout: number[];
  setLayout: Dispatch<SetStateAction<number[]>>;
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
  fallbackLayout: number[];
};
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
  const fallbackLayout = [20, 32, 48];

  const isMobile = useIsMobile();
  useEffect(() => {
    if (isMobile) {
      console.log(isMobile);
      setLayout([0, 40, 60]);
      console.log("Layout changed to mobile:",[0, 40, 60]);
      
    } else {
      setLayout(fallbackLayout)
      console.log("Layout changed to desktop:", fallbackLayout);
    }
  }, [isMobile]);

  return (
    <LayoutContext.Provider
      value={{ layout, setLayout, isCollapsed, setIsCollapsed, fallbackLayout }}
    >
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
