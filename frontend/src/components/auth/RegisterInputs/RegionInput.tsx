"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RegionInputProps {
  regions: { id: string; name: string }[]
  selectedRegion: string
  onSelectRegion: (regionId: string) => void
  disabled: boolean
}

export function RegionInput({ regions, selectedRegion, onSelectRegion, disabled }: RegionInputProps) {
  return (
    <div className="grid gap-2">
      <Label>Región</Label>
      <Select value={selectedRegion} onValueChange={onSelectRegion} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona tu región" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem key={region.id} value={region.id}>
              {region.name.length > 35
              ? (region.name.charAt(0).toUpperCase() + region.name.slice(1).toLowerCase()).slice(0, 35) + "..."
              : region.name.charAt(0).toUpperCase() + region.name.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}