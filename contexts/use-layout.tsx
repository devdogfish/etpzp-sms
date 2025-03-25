"use client";

import { fetchAmountIndicators } from "@/lib/db/general";
import { AmountIndicators } from "@/types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type LayoutContextType = {
  amountIndicators: AmountIndicators | undefined;
  fallbackLayout: number[];

  layout: number[];
  setLayout: Dispatch<SetStateAction<number[]>>;

  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;

  mobileNavPanel: boolean;
  setMobileNavPanel: Dispatch<SetStateAction<boolean>>;

  isFullscreen: boolean;
  setIsFullscreen: Dispatch<SetStateAction<boolean>>;

  refetchAmountIndicators: () => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({
  children,
  initialLayout,
  initialIsCollapsed,
  initialAmountIndicators,
}: {
  children: React.ReactNode;
  initialLayout: number[];
  initialIsCollapsed: boolean;
  initialAmountIndicators: AmountIndicators | undefined;
}) {
  // desktop layout 3 column react-resizable-panels data
  const [layout, setLayout] = useState(initialLayout);
  const [isCollapsed, setIsCollapsed] = useState(initialIsCollapsed);
  const fallbackLayout = [20, 32, 48];
  const [amountIndicators, setAmountIndicators] = useState(
    initialAmountIndicators
  );
  // as simple state to keep track of whether the mobile nav panel is open
  const [mobileNavPanel, setMobileNavPanel] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const refetchAmountIndicators = async () => {
    const amountIndicators = await fetchAmountIndicators();

    if (amountIndicators) {
      setAmountIndicators(amountIndicators);
    }
  };

  useEffect(() => {
    setAmountIndicators(initialAmountIndicators);
  }, [initialAmountIndicators]);
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
        refetchAmountIndicators,
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
