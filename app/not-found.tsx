import ChildrenPanel from "@/components/shared/children-panel";
import { Button, buttonVariants } from "@/components/ui/button";
import { Frown } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    // <ChildrenPanel>
    <div className="h-full flex flex-col items-center justify-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <Frown className="text-muted-foreground h-10 w-10 stroke-[1.2px]" />
        <div className="flex flex-col items-center">
          <h2>404 Not Found!</h2>
          <p className="text-sm">Could not find the requested resource.</p>
        </div>
      </div>
      <Link href="/" className={buttonVariants({ variant: "default" })}>
        Go Back
      </Link>
    </div>
    // </ChildrenPanel>
  );
}
