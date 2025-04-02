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
import { format, parseISO, subDays } from "date-fns";
import { capitalize, cn, getDateFnsLocale } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DEFAULT_START_DATE,
  ISO8601_DATE_FORMAT,
  PT_DATE_FORMAT_NO_TIME,
} from "@/global.config";
import { LightDBMessage } from "@/types/dashboard";
import { zodISODate } from "@/lib/form.schemas";
import { buttonVariants } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { getThemeByIndex } from "@/lib/theme.colors";
import { useSettings } from "@/contexts/use-settings";
import { useTheme as useNextTheme } from "next-themes";
import { ThemeMode } from "@/types/theme";

export default function MessageAreaChart({
  messages,
}: {
  messages: LightDBMessage[];
}) {
  const now = new Date();
  const { i18n, t } = useTranslation(["dashboard-page"]);
  const data = toChartData(messages);
  const router = useRouter();
  const pathname = usePathname();
  const onMobile = useIsMobile();
  const searchParams = useSearchParams();
  const { settings } = useSettings();
  const { theme } = useNextTheme();
  const areaChartColors = [
    `hsl(${
      getThemeByIndex(settings.profileColorId || 1, theme as ThemeMode)?.primary
    })`, // Current profile theme color-props
    "hsl(var(--primary))", // Current appearance theme color-props
  ];

  // This should get updated by re-renders, if not, turn it into a useState that gets set by a useEffect
  const selectedStartDate = {
    ISO_date: searchParams.get("start_date"),
    isValid: zodISODate.safeParse(searchParams.get("start_date")).success,
  };

  function toISO(date: Date) {
    return format(date, ISO8601_DATE_FORMAT);
  }
  const selectItems = [
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
      date: new Date(DEFAULT_START_DATE),
    },
  ];

  const chartConfig = {
    amount: {
      label: t("messages_amount"),
    },
    price: {
      label: t("cost"),
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>
            {t("area_chart-title")} ({data.length})
          </CardTitle>
          <CardDescription>{t("area_chart-title_caption")}</CardDescription>
        </div>
        <Select
          defaultValue={searchParams.get("start_date") || DEFAULT_START_DATE}
          onValueChange={(value) => {
            const params = new URLSearchParams(searchParams);

            if (value) {
              params.set("start_date", value);
            } else {
              params.delete("start_date");
            }
            if (params.has("end_date")) params.delete("end_date");
            router.replace(`${pathname}?${params.toString()}`, {
              scroll: false, // persist current scroll for better ux
            });
          }}
        >
          <SelectTrigger
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-min appearance-none font-normal justify-between"
            )}
            // className="w-[160px] rounded-lg sm:ml-auto"
            aria-label={t("common:aria_label-select")}
          >
            <SelectValue placeholder={t("area_chart-3_months")} />
          </SelectTrigger>
          <SelectContent align={onMobile ? "center" : "end"}>
            {selectItems.map((item) => (
              <SelectItem key={item.date.getTime()} value={toISO(item.date)}>
                {item.label}
              </SelectItem>
            ))}
            {selectedStartDate.ISO_date &&
              !selectItems.some(
                (item) => toISO(item.date) === selectedStartDate.ISO_date
              ) && (
                <SelectItem value={selectedStartDate.ISO_date} disabled>
                  {selectedStartDate.isValid
                    ? format(
                        new Date(selectedStartDate.ISO_date),
                        PT_DATE_FORMAT_NO_TIME
                      )
                    : selectedStartDate.ISO_date}
                </SelectItem>
              )}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              {/* Gradient of the chart waves */}
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={areaChartColors[0]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={areaChartColors[0]}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={areaChartColors[1]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={areaChartColors[1]}
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
              wrapperClassName="z-80"
              content={
                <ChartTooltipContent
                  className="z-80"
                  labelFormatter={(dateString: string) => {
                    // The error we were having is that between state updates and re-renders, sometimes the label date was not a valid date, so we need to handle the date formatting gracefully to prevent a thrown error from format
                    const parsedDate = parseISO(dateString);
                    return isNaN(parsedDate.getTime()) // check if the date is valid before trying to format it
                      ? t("invalid_date")
                      : format(parsedDate, "MMM d, yyyy", {
                          locale: getDateFnsLocale(i18n.language),
                        });
                  }}
                  indicator="dot"
                />
              }
            />
            {/* Line at the top of the chart waves */}
            <Area
              dataKey="price"
              type="natural"
              fill="url(#fillPrice)"
              stroke={areaChartColors[0]}
              stackId="a"
            />
            <Area
              dataKey="amount"
              type="natural"
              fill="url(#fillAmount)"
              stroke={areaChartColors[1]}
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
  messages: LightDBMessage[]
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
