import ChildrenPanel from "@/components/shared/children-panel";

export default function Layout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return <ChildrenPanel>{children}</ChildrenPanel>;
}
