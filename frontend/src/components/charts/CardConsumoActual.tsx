"use client"

import { TrendingUp } from "lucide-react"
import { Label } from "recharts"

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
  { month: "Enero", dispositivo1: 186, dispositivo2: 80 },
  { month: "Febrero", dispositivo1: 305, dispositivo2: 200 },
  { month: "Marzo", dispositivo1: 237, dispositivo2: 120 },
  { month: "Abril", dispositivo1: 73, dispositivo2: 190 },
  { month: "Mayo", dispositivo1: 209, dispositivo2: 130 },
  { month: "Junio", dispositivo1: 214, dispositivo2: 140 },
]

const chartConfig = {

 dispositivo1: {
    label: "dispositivo1",
    color: "hsl(var(--chart-1))",
  },
  dispositivo2: {
    label: "dispositivo2",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function ConsumoActual() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumo total actual</CardTitle>
        <CardDescription>
          Mostrando el consumo actual en tiempo real de todos los dispositivos
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-2/4 cursor-pointer">
        <Label className="text-muted-foreground">Consumo actual</Label>
        <h1 className="text-4xl font-bold">234 kWh</h1>
      </CardContent>
    </Card>
  )
}
