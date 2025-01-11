import ResizablePanelWrapper from "@/components/resizable-panel-wrapper";
import { ResizableHandle } from "@/components/ui/resizable";
import NavPanel from "@/components/nav-panel";
import { fetchAmountIndicators } from "@/lib/db/message";

type AppLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const amountIndicators = await fetchAmountIndicators();

  return (
    <ResizablePanelWrapper >
        <NavPanel navCollapsedSize={4} amountIndicators={amountIndicators} />

      {children}
    </ResizablePanelWrapper>
  );
}
