"use client"

import { useState, useEffect } from 'react'
import { CountryInput } from '@/components/auth/RegisterInputs/CountryInput'
import { RegionInput } from '@/components/auth/RegisterInputs/RegionInput'
import { ComunaInput } from '@/components/auth/RegisterInputs/ComunaInput'

interface Location {
    id: string
    name: string
}

export function AddressSelector() {
    const [countries, setCountries] = useState<Location[]>([])
    const [regions, setRegions] = useState<Location[]>([])
    const [comunas, setComunas] = useState<Location[]>([])
    const [selectedCountry, setSelectedCountry] = useState<string>('')
    const [selectedRegion, setSelectedRegion] = useState<string>('')
    const [selectedComuna, setSelectedComuna] = useState<string>('')

    useEffect(() => {
        fetchCountries()
    }, [])

    useEffect(() => {
        if (selectedCountry) {
            fetchRegions(selectedCountry)
        } else {
            setRegions([])
            setSelectedRegion('')
        }
    }, [selectedCountry])

    useEffect(() => {
        if (selectedRegion) {
            fetchComunas(selectedRegion)
        } else {
            setComunas([])
            setSelectedComuna('')
        }
    }, [selectedRegion])

    const fetchCountries = async () => {
        try {
            const response = await fetch(`api/utils/get-countries`)
            const data = await response.json()
            setCountries(data)
        } catch (error) {
            console.error('Error fetching countries:', error)
        }
    }

    const fetchRegions = async (countryId: string) => {
        try {
            const response = await fetch(`api/utils/get-regions?country=${countryId}`)
            const data = await response.json()
            setRegions(data)
        } catch (error) {
            console.error('Error fetching regions:', error)
        }
    }

    const fetchComunas = async (regionId: string) => {
        try {
            const response = await fetch(`api/utils/get-comuna?region=${regionId}`)
            const data = await response.json()
            setComunas(data)
        } catch (error) {
            console.error('Error fetching comunas:', error)
        }
    }

    return (
        <>
            <CountryInput
                countries={countries}
                selectedCountry={selectedCountry}
                onSelectCountry={setSelectedCountry}
            />
            <RegionInput
                regions={regions}
                selectedRegion={selectedRegion}
                onSelectRegion={setSelectedRegion}
                disabled={!selectedCountry}
            />
            <ComunaInput
                comunas={comunas}
                selectedComuna={selectedComuna}
                onSelectComuna={setSelectedComuna}
                disabled={!selectedRegion}
            />
        </>
    )
}