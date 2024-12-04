"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DispositivoFormProps {
  nombreInicial: string
  descripcionInicial: string
  limiteMensualInicial: number
  limiteDiarioInicial: number
  limiteConstanteInicial: number
  limiteMensualActivado: boolean
  limiteDiarioActivado: boolean
  limiteConstanteActivado: boolean
  className?: string
  onGuardar: (datos: DispositivoFormData) => void
}

interface DispositivoFormData {
  nombre: string
  descripcion: string
  limiteMensual: number
  limiteDiario: number
  limiteConstante: number
  limiteMensualActivado: boolean
  limiteDiarioActivado: boolean
  limiteConstanteActivado: boolean
}

export default function ConfiguracionDispositivo({
  nombreInicial,
  descripcionInicial,
  limiteMensualInicial,
  limiteDiarioInicial,
  limiteConstanteInicial,
  limiteMensualActivado,
  limiteDiarioActivado,
  limiteConstanteActivado,
  className,
  onGuardar
}: DispositivoFormProps) {
  const [nombre, setNombre] = useState(nombreInicial)
  const [descripcion, setDescripcion] = useState(descripcionInicial)
  const [limiteMensual, setLimiteMensual] = useState(limiteMensualInicial)
  const [limiteDiario, setLimiteDiario] = useState(limiteDiarioInicial)
  const [limiteConstante, setLimiteConstante] = useState(limiteConstanteInicial)
  const [limiteMensualActivo, setLimiteMensualActivo] = useState(limiteMensualActivado)
  const [limiteDiarioActivo, setLimiteDiarioActivo] = useState(limiteDiarioActivado)
  const [limiteConstanteActivo, setLimiteConstanteActivo] = useState(limiteConstanteActivado)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGuardar({
      nombre,
      descripcion,
      limiteMensual,
      limiteDiario,
      limiteConstante,
      limiteMensualActivado: limiteMensualActivo,
      limiteDiarioActivado: limiteDiarioActivo,
      limiteConstanteActivado: limiteConstanteActivo
    })
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Configuración del Dispositivo</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del dispositivo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del dispositivo"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="limiteMensual">Límite de consumo mensual (kWh)</Label>
              <Switch
                id="limiteMensualSwitch"
                checked={limiteMensualActivo}
                onCheckedChange={setLimiteMensualActivo}
              />
            </div>
            <Input
              id="limiteMensual"
              type="number"
              value={limiteMensual}
              onChange={(e) => setLimiteMensual(Number(e.target.value))}
              disabled={!limiteMensualActivo}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="limiteDiario">Límite de consumo diario (kWh)</Label>
              <Switch
                id="limiteDiarioSwitch"
                checked={limiteDiarioActivo}
                onCheckedChange={setLimiteDiarioActivo}
              />
            </div>
            <Input
              id="limiteDiario"
              type="number"
              value={limiteDiario}
              onChange={(e) => setLimiteDiario(Number(e.target.value))}
              disabled={!limiteDiarioActivo}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="limiteConstante">Límite de consumo constante (W)</Label>
              <Switch
                id="limiteConstanteSwitch"
                checked={limiteConstanteActivo}
                onCheckedChange={setLimiteConstanteActivo}
              />
            </div>
            <Input
              id="limiteConstante"
              type="number"
              value={limiteConstante}
              onChange={(e) => setLimiteConstante(Number(e.target.value))}
              disabled={!limiteConstanteActivo}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Guardar cambios</Button>
        </CardFooter>
      </form>
    </Card>
  )
}