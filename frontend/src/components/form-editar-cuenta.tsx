'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HelpForm } from "@/components/auth/HelpForm"
import { CircleDollarSign, Zap } from 'lucide-react'

interface Item {
  id: string;
  name: string;
}

export default function FormCuenta() {
  const [editando, setEditando] = useState(false)
  // User
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [secondLastName, setSecondLastName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  // Address
  const [country, setCountry] = useState('')
  const [countryId, setCountryId] = useState('')
  const [region, setRegion] = useState('')
  const [regionId, setRegionId] = useState('')
  const [comuna, setComuna] = useState('')
  const [comunaId, setComunaId] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  // Contract
  const [electricityCompany, setElectricityCompany] = useState('')
  const [electricityCompanyId, setElectricityCompanyId] = useState('')
  const [electrictyCost, setElectricityCost] = useState('')
  const [serviceAdministrationCost, setServiceAdministrationCost] = useState('')
  const [transportCost, setTransportCost] = useState('')
  const [kWhConsumed, setKWhConsumed] = useState('')
  const [lastMonthElectricityCost, setLastMonthElectricityCost] = useState('')

  // Lists
  const [listCountry, setListCountry] = useState<Item[]>([])
  const [listRegion, setListRegion] = useState<Item[]>([])
  const [listComuna, setListComuna] = useState<Item[]>([])
  const [listEmpresa, setListEmpresa] = useState<Item[]>([])

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

  // Fetches
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/utils/get-user-data')
      if (response.ok) {
        const data = await response.json()
        // User
        setFirstName(data.user.first_name)
        setLastName(data.user.last_name)
        setSecondLastName(data.user.second_last_name)
        setEmail(data.user.email)
        setPhoneNumber(data.user.phone_number)
        setCountryCode(data.user.country_code)
        // Address
        setCountry(data.address.country)
        setRegion(data.address.region)
        setComuna(data.address.comuna)
        setStreet(data.address.street_name)
        setNumber(data.address.street_number)
        // Contract
        setElectricityCompany(data.contract.electricity_company)
        setElectricityCost(data.contract.electricity_cost)
        setServiceAdministrationCost(data.contract.service_administration_cost)
        setTransportCost(data.contract.transport_cost)
      } else {
        console.error("[User] API response not OK")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/utils/get-countries')
      const data = await response.json()
      setListCountry(data)
      const countryItem = data.find((item: Item) => item.name === country)
      if (countryItem) {
        setCountryId(countryItem.id)
      }
    } catch (error) {
      console.error("Error fetching countries:", error)
    }
  }

  const fetchRegions = async (countryId: string) => {
    try {
      const response = await fetch(`/api/utils/get-regions?country=${countryId}`)
      const data = await response.json()
      setListRegion(data)
      const regionItem = data.find((item: Item) => item.name === region)
      if (regionItem) {
        setRegionId(regionItem.id)
      }
    } catch (error) {
      console.error("Error fetching regions:", error)
    }
  }

  const fetchComunas = async (regionId: string) => {
    try {
      const response = await fetch(`/api/utils/get-comuna?region=${regionId}`)
      const data = await response.json()
      setListComuna(data)
      const comunaItem = data.find((item: Item) => item.name === comuna)
      if (comunaItem) {
        setComunaId(comunaItem.id)
      }
    } catch (error) {
      console.error("Error fetching comunas:", error)
    }
  }

  const fetchEmpresas = async () => {
    try {
      const response = await fetch('/api/utils/get-empresas')
      const data = await response.json()
      setListEmpresa(data)
      const empresaItem = data.find((item: Item) => item.name === electricityCompany)
      if (empresaItem) {
        setElectricityCompanyId(empresaItem.id)
      }
    } catch (error) {
      console.error("Error fetching empresas:", error)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  useEffect(() => {
    if (country) {
      fetchCountries()
    }
  }, [country])

  useEffect(() => {
    if (countryId) {
      fetchRegions(countryId)
    }
  }, [countryId])

  useEffect(() => {
    if (regionId) {
      fetchComunas(regionId)
    }
  }, [regionId])

  useEffect(() => {
    if (electricityCompany) {
      fetchEmpresas()
    }
  }, [electricityCompany])

  useEffect(() => {
    if (kWhConsumed && lastMonthElectricityCost) {
      const kWh = parseFloat(kWhConsumed)
      const cost = parseFloat(lastMonthElectricityCost)
      if (kWh > 0) {
        setElectricityCost(Math.round(cost / kWh).toString())
      }
    }
  }, [kWhConsumed, lastMonthElectricityCost])

  useEffect(() => {
    if (kWhConsumed && transportCost) {
      const kWh = parseFloat(kWhConsumed)
      const cost = parseFloat(transportCost)
      if (kWh > 0) {
        setTransportCost(Math.round(cost / kWh).toString())
      }
    }
  }, [kWhConsumed, transportCost])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // TODO: Implement API call to save changes
    console.log("Saving changes...")
    setEditando(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User info */}
        <section id="userinfo">
          <h4 className="m-5 font-semibold">Información personal</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first-name">Nombre</Label>
              <Input 
                id="first-name" 
                type="text" 
                disabled={!editando} 
                className="mt-1" 
                value={capitalize(firstName)} 
                onChange={(e) => setFirstName(e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="last-name">Apellido</Label>
              <Input 
                id="last-name" 
                type="text" 
                disabled={!editando} 
                className="mt-1" 
                value={capitalize(lastName)} 
                onChange={(e) => setLastName(e.target.value)} 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="second-last-name">Segundo Apellido</Label>
              <Input 
                id="second-last-name" 
                type="text" 
                disabled={!editando} 
                className="mt-1" 
                value={capitalize(secondLastName)} 
                onChange={(e) => setSecondLastName(e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="email">Correo</Label>
              <Input 
                id="email" 
                type="email" 
                disabled={!editando} 
                className="mt-1" 
                value={email.toLowerCase()} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Número de teléfono</Label>
            <Input 
              id="phone" 
              type="text" 
              disabled={!editando} 
              className="mt-1" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
            />
          </div>
        </section>

        {/* Address info */}
        <section id="addressinfo">
          <h4 className="m-5 font-semibold">Información de contacto</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">País</Label>
              <Select 
                value={countryId} 
                onValueChange={(value) => {
                  setCountryId(value)
                  const selectedCountry = listCountry.find(c => c.id === value)
                  if (selectedCountry) {
                    setCountry(selectedCountry.name)
                  }
                }} 
                disabled={!editando}
              >
                <SelectTrigger>
                  <SelectValue placeholder={country || "Selecciona tu país"} />
                </SelectTrigger>
                <SelectContent>
                  {listCountry.map((pais) => (
                    <SelectItem key={pais.id} value={pais.id}>
                      {pais.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <Select 
                value={regionId} 
                onValueChange={(value) => {
                  setRegionId(value)
                  const selectedRegion = listRegion.find(r => r.id === value)
                  if (selectedRegion) {
                    setRegion(selectedRegion.name)
                  }
                }} 
                disabled={!editando || !countryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={region || "Selecciona tu región"} />
                </SelectTrigger>
                <SelectContent>
                  {listRegion.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='mt-1 mb-1'>
            <Label htmlFor="comuna">Comuna</Label>
            <Select 
              value={comunaId} 
              onValueChange={(value) => {
                setComunaId(value)
                const selectedComuna = listComuna.find(c => c.id === value)
                if (selectedComuna) {
                  setComuna(selectedComuna.name)
                }
              }} 
              disabled={!editando || !regionId}
            >
              <SelectTrigger>
                <SelectValue placeholder={comuna || "Selecciona tu comuna"} />
              </SelectTrigger>
              <SelectContent>
                {listComuna.map((comuna) => (
                  <SelectItem key={comuna.id} value={comuna.id}>
                    {comuna.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="street-name">Calle</Label>
              <Input 
                id="street-name" 
                type="text" 
                disabled={!editando || !comunaId} 
                className="mt-1" 
                value={capitalize(street)} 
                onChange={(e) => setStreet(e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="street-number">Numero calle</Label>
              <Input 
                id="street-number" 
                type="text" 
                disabled={!editando || !street} 
                className="mt-1" 
                value={number} 
                onChange={(e) => setNumber(e.target.value)} 
              />
            </div>
          </div>
        </section>

        {/* Contract info */}
        <section id="contractInfo">
          <h4 className="m-5 font-semibold">Información de contrato</h4>
          <div className='mt-1 mb-1'>
            <Label htmlFor="electricity_company">Empresa</Label>
            <Select 
              value={electricityCompanyId} 
              onValueChange={(value) => {
                setElectricityCompanyId(value)
                const selectedCompany = listEmpresa.find(e => e.id === value)
                if (selectedCompany) {
                  setElectricityCompany(selectedCompany.name)
                }
              }} 
              disabled={!editando}
            >
              <SelectTrigger>
                <SelectValue placeholder={electricityCompany || "Selecciona tu empresa"} />
              </SelectTrigger>
              <SelectContent>
                {listEmpresa.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='mt-1 mb-1'>
            <Label htmlFor="service_administration_cost">Costo administración</Label>
            <div className='relative'>
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <CircleDollarSign className="h-5 w-5" />
              </span>
              <Input 
                id="service_administration_cost" 
                type="text" 
                disabled={!editando} 
                className="mt-1 pl-10"  
                value={serviceAdministrationCost} 
                onChange={(e) => setServiceAdministrationCost(e.target.value)} 
              />
            </div>
          </div>
          <div className='mt-1 mb-1'>
            <Label htmlFor="kwh_consumidos_ultimo_mes">KWh Consumidos ultimo mes</Label>
            <div className='relative'>
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Zap className="h-5 w-5" />
              </span>
              <Input 
                id="kwh_consumidos_ultimo_mes" 
                type="text" 
                disabled={!editando} 
                className="mt-1 pl-10"  
                value={kWhConsumed} 
                onChange={(e) => setKWhConsumed(e.target.value)} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="costo_kwh_ultimo_mes">Costo kWh ultimo mes</Label>
              <div className='relative'>
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <CircleDollarSign className="h-5 w-5" />
                </span>
                <Input 
                  id="costo_khw_ultimo_mes" 
                  type="text" 
                  disabled={!editando} 
                  className="mt-1 pl-10" 
                  value={lastMonthElectricityCost} 
                  onChange={(e) => setLastMonthElectricityCost(e.target.value)} 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="costo_transporte_electrico">Costo transporte electrico</Label>
              <div className='relative'>
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <CircleDollarSign className="h-5 w-5" />
                </span>
                <Input 
                  id="costo_transporte_electrico" 
                  type="text" 
                  disabled={!editando} 
                  className="mt-1 pl-10" 
                  value={transportCost} 
                  onChange={(e) => setTransportCost(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="electricity_cost">Costo electricidad por kWh</Label>
              <div className='relative'>
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <CircleDollarSign className="h-5 w-5" />
                </span>
                <Input 
                  id="electricity_cost" 
                  type="text" 
                  disabled 
                  className="mt-1 pl-10" 
                  value={electrictyCost} 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="transport_cost">Costo transporte por kWh</Label>
              <div className='relative'>
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <CircleDollarSign className="h-5 w-5" />
                </span>
                <Input 
                  id="transport_cost" 
                  type="text" 
                  disabled 
                  className="mt-1 pl-10" 
                  value={transportCost} 
                />
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <HelpForm />
          <Button type="button" variant="outline" onClick={() => setEditando(!editando)}>
            {editando ? 'Cancelar' : 'Modificar'}
          </Button>
          <Button type="submit" disabled={!editando}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  )
}