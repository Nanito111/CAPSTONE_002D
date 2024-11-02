"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CountryInputProps {
  countries: { id: string; name: string }[]
  selectedCountry: string
  onSelectCountry: (countryId: string) => void
}

export function CountryInput({ countries, selectedCountry, onSelectCountry }: CountryInputProps) {
  return (
    <div className="grid gap-2">
      <Label>País</Label>
      <Select value={selectedCountry} onValueChange={onSelectCountry}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona tu país" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.id} value={country.id}>
              {country.name.charAt(0).toUpperCase() + country.name.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}