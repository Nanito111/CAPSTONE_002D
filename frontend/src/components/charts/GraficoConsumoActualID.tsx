"use client"
import { Label } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"

export const description = "Grafico estatico de area con gradiente"

export default function ConsumoActualID({ consumo, nombreDispositivo, preciokwh, precioTransporteElectricidad }: { consumo: string, nombreDispositivo: string, preciokwh: number | string, precioTransporteElectricidad: number | string }): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumo total actual</CardTitle>
        <CardDescription>
          Mostrando el consumo actual en tiempo real de {nombreDispositivo}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-2/4 cursor-pointer">
        <Label className="text-muted-foreground">Consumo actual</Label>
        <h1 className="text-4xl font-bold pt-10">{consumo}</h1>
        <p>${preciokwh} kWh </p>
        <p>${precioTransporteElectricidad} Transporte de electricidad</p>
      </CardContent>
    </Card>
  )
}
