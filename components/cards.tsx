import React from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";

type LinkCardProps = {
  href: string;
  title: string;
  heroValue: string | number;
  Icon: any;
};
export default function LinkCard({
  href,
  title,
  heroValue,
  Icon,
}: LinkCardProps) {
  return (
    <Link href={href} className="flex-1 max-w-[350px]">
      <Card className="shadow-none hover:bg-muted dark:hover:bg-muted relative overflow-hidden ">
        <CardHeader>
          <div className="flex justify-between items-center gap-8">
            <div>
              <CardTitle>{title}</CardTitle>
              <h1 className="font-medium leading-tight">{heroValue}</h1>
            </div>
            <div className="">
              <Icon
                fill="hsl(var(--primary))"
                height={65}
                width={65}
                className="absolute rotate-[-15deg] bottom-[-3px] right-[25px] opacity-25"
              />
              {/* you may change the order of these to see what works best */}
              <Icon
                fill="hsl(var(--primary))"
                height={70}
                width={70}
                className="absolute rotate-[-7deg] bottom-[-2px] right-[-5px] opacity-80"
              />
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
