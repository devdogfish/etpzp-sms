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
import { capitalize } from "@/lib/utils";
import { TimeRange } from "@/app/[locale]/dashboard/admin-dashboard";
import { format } from "date-fns";
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
          {capitalize(t("messages"))}
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
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value, name) => [`${value} ${t("messages")}`, name]}
              />
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
