"use client"
import { useState, useEffect } from "react";
import { CostInput } from "@/components/auth/RegisterInputs/CostInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleDollarSign } from "lucide-react";

export function CostCalculator() {
    const [kWhUltimoMes, setkWhUltimoMes] = useState<number | null>(null);
    const [costoElectricidadUltimoMes, setCostoElectricidadUltimoMes] = useState<number | null>(null);
    const [costoTransporteElectrico, setCostoTransporteElectrico] = useState<number | null>(null);
    const [totalCostkWh, setTotalCostkWh] = useState<number | null>(null);
    const [totalCostTransporte, setTotalCostTransporte] = useState<number | null>(null);

    const handleCostChange = (tipoCosto: string, value: number) => {
        if (tipoCosto === "Costo electricidad último mes") {
            setCostoElectricidadUltimoMes(value);
        } else if (tipoCosto === "kWh Consumidos ultimo mes") {
            setkWhUltimoMes(value);
        } else if (tipoCosto === "Costo transporte electrico") {
            setCostoTransporteElectrico(value);
        }
    };

    useEffect(() => {
        const calcularCostokWhTotal = () => {
            if (costoElectricidadUltimoMes !== null && kWhUltimoMes !== null && kWhUltimoMes !== 0) {
                const cost = costoElectricidadUltimoMes / kWhUltimoMes;
                setTotalCostkWh(Number(cost.toFixed(2)));
            } else {
                setTotalCostkWh(null);
            }
        };
        const calcularCostroTransporteElectrico = () => {
            if (costoTransporteElectrico !== null && kWhUltimoMes !== null && kWhUltimoMes !== 0){
                const cost = costoTransporteElectrico / kWhUltimoMes;
                setTotalCostTransporte(Number(cost.toFixed(2)));
            } else {
                setTotalCostTransporte(null);
            }
        };
        calcularCostokWhTotal();
        calcularCostroTransporteElectrico();
    }, [costoElectricidadUltimoMes, costoTransporteElectrico, kWhUltimoMes]);

    return (
        <div className="space-y-4">
            <CostInput
                tipoCosto="kWh Consumidos ultimo mes"
                placeholder="999 kWh "
                onValueChange={(value) => handleCostChange("kWh Consumidos ultimo mes", value)}
            />
            <CostInput
                tipoCosto="Costo electricidad último mes"
                placeholder="1000"
                onValueChange={(value) => handleCostChange("Costo electricidad último mes", value)}
            />
            <CostInput
                tipoCosto="Costo transporte electrico"
                placeholder="1000"
                onValueChange={(value) => handleCostChange("Costo transporte electrico", value)}
            />
            <div className="grid gap-2">
                <Label htmlFor="totalCostkWh">Costo de electricidad por kWh</Label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        <CircleDollarSign className="h-5 w-5" />
                    </span>
                    <Input
                        id="totalCostkWh"
                        type="text"
                        value={totalCostkWh !== null ? `${totalCostkWh}` : ''}
                        readOnly
                        className="pl-10 pr-10"
                        />
                </div>
            </div>
            <div className="grid gap-2">
            <Label htmlFor="totalCostTransporte">Costo transporte electrico por kWh</Label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                            <CircleDollarSign className="h-5 w-5" />
                        </span>
                        <Input
                            id="totalCostTransporte"
                            type="text"
                            value={totalCostTransporte !== null ? `${totalCostTransporte}` : ''}
                            readOnly
                            className="pl-10 pr-10"
                        />
                </div>
            </div>
        </div>
    );
}