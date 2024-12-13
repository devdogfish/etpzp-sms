import { Separator } from "@/components/ui/separator";

type PageHeaderProps = {
  title: string;
  children: React.ReactNode;
};
export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <>
      <div className="flex items-center px-4 h-[52px]">
        <h2 className="mr-auto">{title}</h2>
        {children}
      </div>
      <Separator />
    </>
  );
}
