"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A stacked bar chart with a legend"

const chartData = [
  { month: "Enero", dispositivo1: 186, dispositivo2: 80 },
  { month: "Febrero", dispositivo1: 305, dispositivo2: 200 },
  { month: "Marzo", dispositivo1: 237, dispositivo2: 120 },
  { month: "Abril", dispositivo1: 73, dispositivo2: 190 },
  { month: "Mayo", dispositivo1: 209, dispositivo2: 130 },
  { month: "Junio", dispositivo1: 214, dispositivo2: 140 },
]

const chartConfig = {
  dispositivo1: {
    label: "Dispositivo 1",
    color: "hsl(var(--chart-1))",
  },
  dispositivo2: {
    label: "Dispositivo 2",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function BarrasApiladas() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desglose del consumo </CardTitle>
        <CardDescription>Junio - Noviembre 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="dispositivo1"
              stackId="a"
              fill="hsl(var(--chart-1))"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="dispositivo2"
              stackId="a"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
        Tu consumo aumento un 5.2% este mes <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Junio - Noviembre 2024
        </div>
      </CardFooter>
    </Card>
  )
}
