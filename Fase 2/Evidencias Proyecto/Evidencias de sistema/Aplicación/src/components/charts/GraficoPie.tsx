"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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

export const description = "Grafico pie en forma de dona"

const chartData = [
  { dispositivo: "Dispositivo 1", consumo: 723, fill: "var(--color-dispositivo-1)" },
  { dispositivo: "Dispositivo 2", consumo: 234, fill: "var(--color-dispositivo-2)" },
  { dispositivo: "Dispositivo 3", consumo: 567, fill: "var(--color-dispositivo-3)" },
  { dispositivo: "Dispositivo 4", consumo: 328, fill: "var(--color-dispositivo-4)" },
  { dispositivo: "Dispositivo 5", consumo: 438, fill: "var(--color-dispositivo-5)" },
]

const chartConfig = {
  dispositivos: {
    label: "Dispositivos",
  },
  "dispositivo-1": {
    label: "Dispositivo 1",
    color: "hsl(var(--chart-1))",
  },
  "dispositivo-2": {
    label: "Dispositivo 2",
    color: "hsl(var(--chart-2))",
  },
  "dispositivo-3": {
    label: "Dispositivo 3",
    color: "hsl(var(--chart-3))",
  },
  "dispositivo-4": {
    label: "Dispositivo 4",
    color: "hsl(var(--chart-4))",
  },
  "dispositivo-5": {
    label: "Dispositivo 5",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export default function GraficoPie() {
  const totalKWh = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.consumo, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Consumo entre dispositivos</CardTitle>
        <CardDescription>Julio 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="consumo"
              nameKey="dispositivo"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalKWh.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          KWh
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Tu consumo aumento un 5.2% este mes <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando el consumo total del mes de Julio
        </div>
      </CardFooter>
    </Card>
  )
}
