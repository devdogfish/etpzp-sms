import React from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import Link from "next/link";

type LinkCardProps = {
  href: string;
  title: string;
  heroValue: string | number;
  iconSrc: string;
};
export default function LinkCard({
  href,
  title,
  heroValue,
  iconSrc,
}: LinkCardProps) {
  return (
    <Link href={href} className="flex-1 max-w-[350px]">
      <Card className="shadow-none hover:bg-muted relative overflow-hidden ">
        <CardHeader>
          <div className="flex justify-between items-center gap-8">
            <div>
              <CardTitle>{title}</CardTitle>
              <h1 className="font-medium leading-tight">{heroValue}</h1>
            </div>
            <div className="">
              <Image
                className="absolute rotate-[-15deg] bottom-[-3px] right-[25px] opacity-25"
                src={iconSrc}
                alt="My Icon"
                width={60}
                height={60}
                color="#F56565"
              />
              <Image
                className="absolute rotate-[-7deg] bottom-[-2px] right-[-5px] opacity-80"
                src={iconSrc}
                alt="My Icon"
                width={65}
                height={65}
              />
              {/* <Icon className="w-24 h-24 rotate-[-5deg] absolute bottom-[-10px] right-[-20px]" strokeWidth={0.6} />
            <Icon
              className="w-24 h-24 rotate-[-20deg] absolute bottom-0 right-0 opacity-25"
              strokeWidth={0.6}
            /> */}
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
