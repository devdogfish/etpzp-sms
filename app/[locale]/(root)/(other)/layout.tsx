"use client";
import { useLayout } from "@/contexts/use-layout";
import ChildrenPanel from "@/components/shared/children-panel";

export default function Layout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const { isFullscreen } = useLayout();
  return (
    <>
      {!isFullscreen ? (
        <ChildrenPanel>{children}</ChildrenPanel>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
