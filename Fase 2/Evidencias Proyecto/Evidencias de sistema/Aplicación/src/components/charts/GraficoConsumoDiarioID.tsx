"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"

export const description = "Gráfico de consumo de energía de las últimas 24 horas"

interface ConsumoData {
  hora: string
  consumo: number
}

interface ConsumoUltimas24HorasProps {
  color: string
  nombreDispositivo: string
  consumoActual: number
  datos: ConsumoData[]
  className?: string
}

export default function GraficoConsumoDiarioID({ color, nombreDispositivo, consumoActual, datos, className }: ConsumoUltimas24HorasProps) {
  const colorVariable = `var(${color})`

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Consumo de energía</CardTitle>
        <CardDescription>
          Consumo de energía en las últimas 24 horas de {nombreDispositivo}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={datos}>
              <XAxis
                dataKey="hora"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  const isMobile = window.innerWidth < 768; // Adjust breakpoint as needed
                  return isMobile ? value.split(':')[0] : value; // Show only hour on mobile
                }}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value} Wh`}
              />
              <Area
                type="monotone"
                dataKey="consumo"
                stroke={colorVariable}
                fill={`url(#color${color.replace('--', '')})`}
                isAnimationActive={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Hora
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[0].payload.hora}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Consumo
                            </span>
                            <span className="font-bold">
                              {payload[0].value} Wh
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <defs>
                <linearGradient id={`color${color.replace('--', '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorVariable} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={colorVariable} stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-col items-center justify-center">
          <span className="text-sm text-muted-foreground">Consumo actual</span>
          <span className="text-2xl font-bold">{consumoActual} Wh</span>
        </div>
      </CardContent>
    </Card>
  )
}