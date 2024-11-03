"use client"

import { useState, useEffect } from 'react'
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Empresa {
  id: string
  name:string
}

export function EmpresaInput() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])

  useEffect(() => {
    fetchEmpresas()
}, [])


  const fetchEmpresas = async () => {
    try {
        const response = await fetch(`api/utils/get-empresas`)
        const data = await response.json()
        setEmpresas(data)
    } catch (error) {
        console.error('Error fetching empresas:', error)
    }
}
  return (
    <div className="grid gap-2">
      <Label>Empresa</Label>
      <Select >
        <SelectTrigger>
          <SelectValue placeholder="Selecciona tu empresa" />
        </SelectTrigger>
        <SelectContent>
          {
            empresas.map((empresa) => (
              <SelectItem key={empresa.id} value={empresa.id}>
                {empresa.name}
              </SelectItem>
            ))
          }
        </SelectContent>
      </Select>
    </div>
  )
}