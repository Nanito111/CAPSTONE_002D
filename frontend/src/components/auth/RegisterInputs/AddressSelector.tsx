"use client"

import { useState, useEffect } from 'react'
import { CountryInput } from './CountryInput'
import { RegionInput } from './RegionInput'
import { ComunaInput } from './ComunaInput'

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
        console.log('Fetching countries...')
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utils/get-countries`)
            const data = await response.json()
            setCountries(data)
            console.log('Fetched countries:', data)
        } catch (error) {
            console.error('Error fetching countries:', error)
        }
    }

    const fetchRegions = async (countryId: string) => {
        console.log(`Fetching regions for country ${countryId}...`)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utils/get-regions?country=${countryId}`)
            const data = await response.json()
            setRegions(data)
            console.log('Fetched regions:', data)
        } catch (error) {
            console.error('Error fetching regions:', error)
        }
    }

    const fetchComunas = async (regionId: string) => {
        console.log(`Fetching comunas for region ${regionId}...`)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utils/get-comuna?region=${regionId}`)
            const data = await response.json()
            setComunas(data)
            console.log('Fetched comunas:', data)
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