"use client";

import { AmountIndicators } from "@/types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type LayoutContextType = {
  amountIndicators: AmountIndicators;
  fallbackLayout: number[];

  layout: number[];
  setLayout: Dispatch<SetStateAction<number[]>>;

  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;

  mobileNavPanel: boolean;
  setMobileNavPanel: Dispatch<SetStateAction<boolean>>;

  isFullscreen: boolean;
  setIsFullscreen: Dispatch<SetStateAction<boolean>>;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({
  children,
  initialLayout,
  initialIsCollapsed,
  amountIndicators,
}: {
  children: React.ReactNode;
  initialLayout: number[];
  initialIsCollapsed: boolean;
  amountIndicators: AmountIndicators;
}) {
  // desktop layout 3 column react-resizable-panels data
  const [layout, setLayout] = useState(initialLayout);
  const [isCollapsed, setIsCollapsed] = useState(initialIsCollapsed);
  const fallbackLayout = [20, 32, 48];

  // as simple state to keep track of whether the mobile nav panel is open
  const [mobileNavPanel, setMobileNavPanel] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  return (
    <LayoutContext.Provider
      value={{
        layout,
        setLayout,
        isCollapsed,
        setIsCollapsed,
        fallbackLayout,
        amountIndicators,
        mobileNavPanel,
        setMobileNavPanel,
        isFullscreen,
        setIsFullscreen,
      }}
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
