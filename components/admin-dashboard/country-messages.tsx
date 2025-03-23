"use client";

import * as React from "react";
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

// Sample data
const sampleData = [
  {
    amount: 116,
    cost: 7.4472,
    country: "DE",
  },
  {
    amount: 7,
    cost: 0.147,
    country: "PT",
  },
];

// Colors
const COLORS = ["#309BF4", "#FEBE06"];

// Country name mapping
const COUNTRY_NAMES = {
  DE: "Germany",
  PT: "Portugal",
};

export default function CountryMessagesChart({
  data = sampleData,
}: {
  data?: { country: string; amount: number; cost: number }[];
}) {
  const totalMessages = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.amount, 0);
  }, [data]);

  const totalCost = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.cost, 0).toFixed(2);
  }, [data]);

  // Find the country with the most messages
  const topCountry = React.useMemo(() => {
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
          Messages
        </text>
      </g>
    );
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Country Messages</CardTitle>
        <CardDescription>Message distribution by country</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 h-[300px]">
        <div className="mx-auto aspect-square h-full max-w-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value, name) => [
                  `${value} messages`,
                  COUNTRY_NAMES[name as keyof typeof COUNTRY_NAMES] || name,
                ]}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                innerRadius={60}
                outerRadius={100}
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
              {COUNTRY_NAMES[
                topCountry.country as keyof typeof COUNTRY_NAMES
              ] || topCountry.country}{" "}
              leads with {topCountry.amount} messages
              <TrendingUp className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Total cost: ${totalCost}
        </div>
      </CardFooter>
    </Card>
  );
}
