"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ComunaInputProps {
  comunas: { id: string; name: string }[]
  selectedComuna: string
  onSelectComuna: (comunaId: string) => void
  disabled: boolean
}

export function ComunaInput({ comunas, selectedComuna, onSelectComuna, disabled }: ComunaInputProps) {
  return (
    <div className="grid gap-2">
      <Label>Comuna</Label>
      <Select value={selectedComuna} onValueChange={onSelectComuna} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona tu comuna" />
        </SelectTrigger>
        <SelectContent>
          {comunas.map((comuna) => (
            <SelectItem key={comuna.id} value={comuna.id}>
              {comuna.name.charAt(0).toUpperCase() + comuna.name.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}