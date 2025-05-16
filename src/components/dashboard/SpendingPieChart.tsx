"use client"

import * as React from "react"
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { Transaction, Category, ChartDataItem } from "@/types";
import { CHART_COLORS } from "@/lib/data";


interface SpendingPieChartProps {
  transactions: Transaction[];
  categories: Category[];
}

export function SpendingPieChart({ transactions, categories }: SpendingPieChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined);

  const dataByCategory = React.useMemo(() => {
    const spending: Record<string, number> = {};
    transactions.forEach(txn => {
      spending[txn.categoryId] = (spending[txn.categoryId] || 0) + txn.amount;
    });

    return Object.entries(spending).map(([categoryId, amount], index) => ({
      name: categories.find(c => c.id === categoryId)?.name || "Uncategorized",
      value: amount,
      fill: CHART_COLORS[index % CHART_COLORS.length],
      id: categoryId,
    })).sort((a,b) => b.value - a.value);
  }, [transactions, categories]);

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    dataByCategory.forEach(item => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      };
    });
    return config;
  }, [dataByCategory]);

  if (transactions.length === 0) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Your spending distribution across categories.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">No spending data available to display chart.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Your spending distribution across categories.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RechartsPieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={dataByCategory}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent }) => (
                <g>
                  <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-semibold">
                    {payload.name}
                  </text>
                  <text x={cx} y={cy! + 20} textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-xs">
                    {`(${(percent! * 100).toFixed(0)}%)`}
                  </text>
                  <Pie
                    data={[payload]}
                    dataKey="value"
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius! + 5} // Expand on hover
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    stroke={fill}
                  />
                </g>
              )}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              {dataByCategory.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
             <Legend content={({ payload }) => {
                if (!payload) return null;
                return (
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs mt-4">
                    {payload.map((entry, index) => (
                      <div key={`item-${index}`} className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        {entry.value} (${dataByCategory.find(d => d.name === entry.value)?.value.toFixed(2)})
                      </div>
                    ))}
                  </div>
                )
              }} />
          </RechartsPieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
