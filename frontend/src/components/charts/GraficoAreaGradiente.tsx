"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "Grafico estatico de area con gradiente"

const chartData = [
  { month: "Enero", dispositivo1: 186 },
  { month: "Febrero", dispositivo1: 305 },
  { month: "Marzo", dispositivo1: 237 },
  { month: "Abril", dispositivo1: 73 },
  { month: "Mayo", dispositivo1: 209 },
  { month: "Junio", dispositivo1: 214 },
]

const chartConfig = {
    dispositivo1: {
    label: "dispositivo1",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface GraficoAreaGradienteProps {
  data: Array<{
    month: string;
    dispositivo1: number;
    dispositivo2: number;
    dispositivo3: number;
    dispositivo4: number;
    dispositivo5: number;
    dispositivo6: number;
    consumoTotal: number;
  }>
}

export default function GraficoAreaGradiente({ data }: GraficoAreaGradienteProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumo por mes</CardTitle>
        <CardDescription>
          Mostrando el consumo total electrico de los ultimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="filldispositivo1" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-dispositivo1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-dispositivo1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="dispositivo1"
              type="natural"
              fill="url(#filldispositivo1)"
              fillOpacity={0.4}
              stroke="var(--color-dispositivo1)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Tu consumo aumento un 5.2% este mes <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Junio - Noviembre 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
