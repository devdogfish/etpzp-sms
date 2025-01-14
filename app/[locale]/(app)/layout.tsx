import ResizablePanelWrapper from "@/components/resizable-panel-wrapper";
import NavPanel from "@/components/nav-panel";
import { fetchAmountIndicators } from "@/lib/db/message";
import { cn } from "@/lib/utils";

type AppLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const amountIndicators = await fetchAmountIndicators();

  return (
    <ResizablePanelWrapper>
      <NavPanel
        navCollapsedSize={4}
        amountIndicators={amountIndicators}
        /* Inside here is already the ResizableHandle */
      />

      {children}
    </ResizablePanelWrapper>
  );
}
