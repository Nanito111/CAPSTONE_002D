"use client"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

export const description = "An area chart with axes"

const chartData = [
  { hora: "12:00", dispositivo: 186, },
  { hora: "14:00", dispositivo: 305, },
  { hora: "16:00", dispositivo: 237, },
  { hora: "18:00", dispositivo: 73, },
  { hora: "20:00", dispositivo: 209, },
  { hora: "22:00", dispositivo: 214, },
  { hora: "24:00", dispositivo: 186, },
  { hora: "02:00", dispositivo: 305, },
  { hora: "04:00", dispositivo: 237, },
  { hora: "06:00", dispositivo: 73, },
  { hora: "08:00", dispositivo: 209, },
  { hora: "10:00", dispositivo: 214, },
]

const chartConfig = {
  dispositivo: {
    label: "Dispositivo",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface GraficoConsumoDiarioProps {
  className?: string
  chartData?: typeof chartData
}

export default function GraficoConsumoDiario( { className, chartData = [] }: GraficoConsumoDiarioProps) {
  return (
    <Card  className={className}>
      <CardHeader>
        <CardTitle>Consumo ultimas 24 horas</CardTitle>
        <CardDescription>
          Mostrando el consumo de las ultimas 24 horas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -20,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false}/>
            <XAxis
              dataKey="hora"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Area
              dataKey="dispositivo"
              type="natural"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.4}
              stroke="hsl(var(--chart-1))"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Ultimas 24 horas del dia {new Date().toLocaleDateString()}
            </div>
            <div>
              Ultima lectura: {chartData.length > 0 ? chartData[chartData.length - 1].dispositivo : 'N/A'} kWh
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
