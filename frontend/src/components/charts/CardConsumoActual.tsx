"use client"
import { Label } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ConsumoActualProps {
  consumo: number
}

export default function ConsumoActual({ consumo }: ConsumoActualProps) {
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
        <h1 className="text-4xl font-bold">{consumo} kWh</h1>
      </CardContent>
    </Card>
  )
}
