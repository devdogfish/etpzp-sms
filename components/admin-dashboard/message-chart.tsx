"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subDays } from "date-fns";
import { capitalize, getDateFnsLocale } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { DBMessage } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ISO8601_DATE_FORMAT } from "@/global.config";

const chartColors = ["#309BF4", "#FEBE06", "#25A544", "#0279FE"];
const ALL_TIME_DATE = "2025-01-01";

export default function MessageHistoryChart({
  messages,
}: {
  messages: DBMessage[];
}) {
  const now = new Date();
  const { i18n, t } = useTranslation();
  const data = toChartData(messages);
  const router = useRouter();
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const startDateString = searchParams.get("start_date");
  const selectValues = [
    {
      label: t("area_chart-week"),
      date: subDays(now, 7), // Subtract 7 days
    },
    {
      label: t("area_chart-month"),
      date: subDays(now, 30), // Subtract 30 days (assuming a 30-day month)
    },
    {
      label: t("area_chart-3_months"),
      date: subDays(now, 90), // Subtract 90 days (assuming a 30-day months)
    },
    {
      label: t("area_chart-all_time"),
      date: new Date(ALL_TIME_DATE),
    },
  ];

  const chartConfig = {
    amount: {
      label: capitalize(t("messages")),
    },
    price: {
      label: t("area_chart-price"),
    },
  } satisfies ChartConfig;
  const filteredData = useMemo(() => {
    const now = new Date(); // Ensure 'now' is defined
    const startDate = startDateString
      ? new Date(startDateString)
      : new Date(ALL_TIME_DATE); // Default to all time if not defined

    return data.filter((item) => {
      const messageDate = new Date(item.date);

      return (
        messageDate >= startDate && messageDate <= now // Check if messageDate is between startDate and now
      );
    });
  }, [data, startDateString]);

  useEffect(() => {
    console.log("startDate changed successfullY!", startDateString);
  }, [startDateString]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{t("area_chart-title")} ({filteredData.length})</CardTitle>
          <CardDescription>{t("area_chart-title_caption")}</CardDescription>
        </div>
        <Select
          defaultValue={
            searchParams.get("start_date") ||
            format(ALL_TIME_DATE, ISO8601_DATE_FORMAT)
          }
          onValueChange={(value) => {
            const params = new URLSearchParams(searchParams);
            if (value) {
              params.set("start_date", value);
            } else {
              params.delete("start_date");
            }
            replace(`${pathname}?${params.toString()}`, { scroll: false });
          }}
        >
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label={t("common:aria_label-select")}
          >
            <SelectValue placeholder={t("area_chart-3_months")} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {selectValues.map((item) => (
              <SelectItem
                key={item.date.getDate()}
                value={format(item.date, ISO8601_DATE_FORMAT)}
                className="rounded-lg"
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartColors[0]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartColors[0]}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartColors[1]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartColors[1]}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return format(new Date(value), "MMM d, yyyy", {
                  locale: getDateFnsLocale(i18n.language),
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return format(new Date(value), "MMM d, yyyy", {
                      locale: getDateFnsLocale(i18n.language),
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="price"
              type="natural"
              fill="url(#fillPrice)"
              stroke={chartColors[0]}
              stackId="a"
            />
            <Area
              dataKey="amount"
              type="natural"
              fill="url(#fillAmount)"
              stroke={chartColors[1]}
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const toChartData = (
  messages: DBMessage[]
): { date: string; price: number; amount: number }[] => {
  const chartDataMap: {
    [key: string]: { totalCost: number; messageCount: number };
  } = {};

  messages.forEach((message) => {
    // Format the date to YYYY-MM-DD
    const date = message.send_time.toISOString().split("T")[0];

    // Initialize the entry for the date if it doesn't exist
    if (!chartDataMap[date]) {
      chartDataMap[date] = { totalCost: 0, messageCount: 0 };
    }

    // Increment the message count
    chartDataMap[date].messageCount += 1;

    // Add to the total cost if the cost is not null
    if (message.cost) {
      // Ensure cost is treated as a number
      const costValue =
        typeof message.cost === "string"
          ? parseFloat(message.cost)
          : message.cost;
      chartDataMap[date].totalCost += costValue;
    }
  });

  // Convert the map to an array
  return Object.entries(chartDataMap).map(([date, counts]) => ({
    date,
    price: counts.totalCost,
    amount: counts.messageCount,
  }));
};
