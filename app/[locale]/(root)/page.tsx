"use client";
import ChildrenPanel from "@/components/shared/children-panel";
import { PageHeader } from "@/components/header";
import { useLayout } from "@/contexts/use-layout";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  const { layout, fallbackLayout } = useLayout();
  return (
    <ChildrenPanel className="h-full flex flex-col items-center">
      {/* <PageHeader title="Welcome to the Etpzp SMS App!" /> */}
      <h1>
        Welcome to the <strong className="text-orange-300">ETPZP-app</strong> app!
      </h1>
      <div className="flex gap-2 w-full justify-center items-center">
        <div className="flex-1">Send a message</div>
        <div className="flex-1">Create a contact</div>
        <div className="flex-1">3</div>
      </div>

      <p className="text-sm mt-auto mb-12">
        Created by{" "}
        <Link
          href="https://github.com/devdogfish"
          className={cn(buttonVariants({ variant: "link" }), " p-0")}
        >
          Luigi Girke
        </Link>
      </p>
    </ChildrenPanel>
  );
}
