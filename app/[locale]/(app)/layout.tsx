import ResizablePanelWrapper from "@/components/resizable-panel-wrapper";
import { ResizableHandle } from "@/components/ui/resizable";
import NavPanel from "@/components/nav-panel";
import { fetchAmountIndicators } from "@/lib/db/message";

interface AppLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const amountIndicatorResults = await fetchAmountIndicators();
  const amountIndicators = amountIndicatorResults?.map((amount) => amount.rows[0].count);
  console.log(amountIndicators);
  

  return (
    <ResizablePanelWrapper>
      <NavPanel navCollapsedSize={4} amountIndicators={amountIndicatorResults} />
      <ResizableHandle withHandle />

      {children}
    </ResizablePanelWrapper>
  );
}
