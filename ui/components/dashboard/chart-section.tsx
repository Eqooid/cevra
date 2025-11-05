"use client"

import { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig, ChartContainer,
  ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart"
import { useFetchChartUsageToken } from "@/hooks/use-chart-usage-token";

/**
 * Configuration for the chart displaying token usage.
 * @constant {ChartConfig} chartConfig - The configuration object for the chart.
 * @author Cristono Wijaya
 */
const chartConfig = {
  views: {
    label: "Page Views",
  },
  token: {
    label: "Token Usage",
    color: "var(--chart-1)",
  }
} satisfies ChartConfig

/**
 * ChartSection component displays a bar chart of token usage over the last 30 days.
 * @returns {JSX.Element} The ChartSection component.
 * @author Cristono Wijaya
 */
export default function ChartSection() {
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("token");
  const data = useFetchChartUsageToken();

  const total = useMemo(
    () => ({
      token: data.reduce((acc, curr) => acc + curr.token, 0)
    }),
    [data]
  );

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Chart Usage Token</CardTitle>
          <CardDescription>
            Showing total usage token for the last 30 days.
          </CardDescription>
        </div>
        <div className="flex">
          {["token"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}