"use client";

import { useState, useEffect, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { capitalize, cn } from "@/lib/utils";
import { CountryStat } from "@/app/[locale]/dashboard/page";

const COLORS = ["#309BF4", "#FEBE06"];

export default function CountryMessagesChart({
  data,
}: {
  data: CountryStat[];
}) {
  const totalMessages = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.amount, 0);
  }, [data]);
  const { t } = useTranslation();

  const totalCost = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.cost, 0).toFixed(2);
  }, [data]);

  // Find the country with the most messages
  const topCountry = useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce((max, curr) => (max.amount > curr.amount ? max : curr));
  }, [data]);

  // Custom center label renderer
  const renderCustomLabel = ({ cx, cy }: any) => {
    return (
      <g>
        <text
          x={cx}
          y={cy}
          fill="var(--foreground)"
          textAnchor="middle"
          dominantBaseline="central"
          className="text-3xl font-bold"
        >
          {totalMessages}
        </text>
        <text
          x={cx}
          y={cy + 24}
          fill="var(--muted-foreground)"
          textAnchor="middle"
          dominantBaseline="central"
          className="text-sm"
        >
          {t("messages_amount")}
        </text>
      </g>
    );
  };

  return (
    <Card className="flex flex-col min-h-[400px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>{t("pie_chart-title")}</CardTitle>
        <CardDescription>{t("pie_chart-title_caption")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 h-[300px]">
        <div className="mx-auto aspect-square h-full max-w-[300px]">
          {/* <ChartContainer config={{}}> */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />

              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                innerRadius={60}
                // outerRadius={100}
                strokeWidth={1}
                fill="#8884d8"
                dataKey="amount"
                nameKey="country"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    strokeWidth={5}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* </ChartContainer> */}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex items-center gap-2 font-medium leading-none">
          {topCountry && (
            <>
              {t("pie_chart-leading_country", {
                country: topCountry.country,
                amount: topCountry.amount,
              })}
              <TrendingUp className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          {t("pie_chart-total_cost")} ${totalCost}
        </div>
      </CardFooter>
    </Card>
  );
}

function CustomTooltip({ active, payload }: any) {
  const { t } = useTranslation();
  if (active && payload && payload.length) {
    return (
      <div
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-slate-200 border-slate-200/50 bg-white px-2.5 py-1.5 text-xs shadow-xl dark:border-slate-800 dark:border-slate-800/50 dark:bg-slate-950"
        )}
      >
        <div className="grid gap-1.5">
          {payload.map((item: any, index: number) => {
            const key = item.name || item.dataKey || "value";
            // const itemConfig = getPayloadConfigFromPayload(
            //   config,
            //   item,
            //   key
            // );
            const indicatorColor = item.payload.fill || item.color;

            return (
              <div
                key={item.dataKey}
                className={cn("flex w-full flex-col items-stretch gap-2 ")} //[&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-slate-500 dark:[&>svg]:text-slate-400
              >
                <div className="flex items-center gap-1">
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: indicatorColor,
                    }}
                  />
                  <div className="font-medium">{item.name}</div>
                </div>

                {/* Key value pairs */}
                <KeyValueInTooltip name={t("cost")} value={item.payload.cost} />
                <KeyValueInTooltip
                  name={t("messages_amount")}
                  value={item.payload.amount}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}

function KeyValueInTooltip({
  name,
  value,
}: {
  name: string;
  value?: string | number;
}) {
  return (
    <div className={cn("flex flex-1 justify-between leading-none")}>
      <div className="grid gap-1.5">
        <span className="text-slate-500 dark:text-slate-400">{name}</span>
      </div>
      {value && (
        <span className="font-mono font-medium tabular-nums text-slate-950 dark:text-slate-50">
          {value}
        </span>
      )}
    </div>
  );
}
