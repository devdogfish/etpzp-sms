import { Separator } from "@/components/ui/separator";

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
};
export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-2 px-4 h-[var(--header-height)]">
        <h2 className="mr-auto">{title}</h2>
        {children}
      </div>
      <Separator />
    </>
  );
}
