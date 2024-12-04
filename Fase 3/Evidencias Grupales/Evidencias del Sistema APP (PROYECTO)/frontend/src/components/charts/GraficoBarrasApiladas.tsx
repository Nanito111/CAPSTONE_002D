"use client"

import {
  TrendingUp,
  TrendingDown,
 } from "lucide-react"
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

const chartConfig = {
  dispositivo1: {
    label: "Dispositivo 1",
    color: "hsl(var(--chart-1))",
  },
  dispositivo2: {
    label: "Dispositivo 2",
    color: "hsl(var(--chart-2))",
  },
  consumoTotal: {
    label: "Consumo total",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface BarrasApiladasProps {
  data: Array<{
      month: string;
      consumoTotal: number;
      dispositivo1: number;
      dispositivo2: number;
      dispositivo3: number;
      dispositivo4: number;
      dispositivo5: number;
      dispositivo6: number;
    }>
  className?: string
}

export default function BarrasApiladas({ data, className }: BarrasApiladasProps) {
  const consumoUltimoMes = data[0].consumoTotal
  const consumoPenultimoMes = data[1].consumoTotal

  const mensajeFooter = () => {
    const diferencia =  ((consumoUltimoMes - consumoPenultimoMes) / consumoPenultimoMes) * 100
    if (diferencia > 0) {
      return `Tu consumo aumento un ${diferencia.toFixed(1)}% a comparación del mes pasado`
    } else {
      return `Tu consumo disminuyo un ${Math.abs(diferencia).toFixed(1)}% a comparación del mes pasado`
    }
  }

  const IconoConsumo = () => {
    const diferencia = ((consumoUltimoMes - consumoPenultimoMes) / consumoPenultimoMes) * 100
    if (diferencia > 0) {
      return <TrendingUp className="h-4 w-4" />
    } else {
      return <TrendingDown className="h-4 w-4" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Desglose del consumo </CardTitle>
        <CardDescription>{data[0].month} - {data[5].month} {new Date().getFullYear()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
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
              dataKey="consumoTotal"
              stackId="a"
              fill="hsl(var(--chart-1))"
              radius={[0, 0, 4, 4]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {mensajeFooter()}
          <IconoConsumo />
        </div>
        <div className="leading-none text-muted-foreground">
          Junio - Noviembre 2024
        </div>
      </CardFooter>
    </Card>
  )
}
