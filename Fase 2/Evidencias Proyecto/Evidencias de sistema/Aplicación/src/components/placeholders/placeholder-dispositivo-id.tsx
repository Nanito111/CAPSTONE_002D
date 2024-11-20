"use client"
import { Command } from "@/components/ui/command";
import { Card, CardContent, CardDescription} from "@/components/ui/card";
import { Microchip } from "lucide-react";
import { usePathname } from "next/navigation";
import {useEffect, useState} from "react";

import ConsumoActualID from "@/components/charts/GraficoConsumoActualID";
import MedidorGaugeID from  "@/components/charts/MedidorGaugeID";
import GraficoConsumoMensualID from "@/components/charts/GraficoConsumoMensualID";
import GraficoConsumoDiarioID from "@/components/charts/GraficoConsumoDiarioID";
import ConfiguracionDispositivo from "@/components/configuracion-dispositivo";

export default function PlaceholderDispositivoID() {
    const [costoElectricidad, setCostoElectricidad] = useState(0);
    const [costoTransporte, setCostoTransporte] = useState(0);
    const pathname = usePathname();



  // !Esto en el futuro debe cambiar, debido a que debe ser consumido por una API.
  const id = pathname.split('/')[2];
  const status = Math.random() > 0.5 ? "Activo" : "Inactivo";

    // obtener info usuarios
    const handleFetchUserData = async() => {
        try {
            const apiEndpoint = "/api/utils/get-user-data";
            const response = await fetch(apiEndpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (response.ok) {
                const data = await response.json();
                setCostoElectricidad(data.contract.electricity_cost);
                setCostoTransporte(data.contract.transport_cost);
                console.log(data);
                console.log("Costo electricidad por fetch:"+ data.contract.electricity_cost)
                console.log("Costo electricidad por useState: "+costoElectricidad)
            }
            else {
                console.error("Error al obtener la informacion del usuario");
                setCostoElectricidad(-1);
                setCostoTransporte(-1);
            }
        } catch (error) {
            console.error("Error al obtener la informacion del usuario");
            setCostoElectricidad(-1);
            setCostoTransporte(-1);
        }
    }

  const Dispositivo = {
    idDispositivo: id,
    nombreDispositivo: "Dispositivo " + id,
    descriptionDispositivo: "Descripcion del dispositivo " + id,
    statusDispositivo: status,
    ultimaConexion: new Date().toLocaleDateString(),
    fechaCreacion: "12/12/2021",
    ultimaMedicion: Math.trunc(Math.random() * (999-10) + 10) + "Wh",
    color: `--device-${id}`, // Ejemplo de color en @/globals.css
}

const consumoDataMensual = [
    { mes: 'Ene', consumo: Math.trunc(Math.random() * (999-10) + 10) },
    { mes: 'Feb', consumo: Math.trunc(Math.random() * (999-10) + 10) },
    { mes: 'Mar', consumo: Math.trunc(Math.random() * (999-10) + 10) },
    { mes: 'Abr', consumo: Math.trunc(Math.random() * (999-10) + 10) },
    { mes: 'May', consumo: Math.trunc(Math.random() * (999-10) + 10) },
    { mes: 'Jun', consumo: Math.trunc(Math.random() * (999-10) + 10) }
];

const consumodatos24Horas = [
  // 24 horas
  { hora: "00:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "01:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "02:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "03:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "04:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "05:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "06:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "07:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "08:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "09:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "10:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "11:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "12:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "13:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "14:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "15:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "16:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "17:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "18:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "19:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "20:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "21:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "22:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "23:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
  { hora: "24:00", consumo: Math.trunc(Math.random() * (999-10) + 10) },
];

useEffect(() => {
    handleFetchUserData();
}, []);

// console.log("Costo electricidad: ", costoElectricidad);
// console.log("Consumo total actual ", Dispositivo.ultimaMedicion.slice(0,-2));
// console.log("Total costo electricidad:", costoElectricidad * +Number(Dispositivo.ultimaMedicion.slice(0,-2)));

return (
    <>
    <Card className="rounded-lg border-none mt-6 w-full">
        <CardContent className="p-6">
            <div className="min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
                <h1 className="m-3 font-bold">Informacion del dispositivo {Dispositivo.nombreDispositivo}</h1>
                <CardDescription>
                    <div className="ml-5 flex items-center space-x-4" style={{ color: `var(${Dispositivo.color})` }}>
                        <Microchip className="h-8 w-8" />
                        <div className="flex-1 space-y-1" >
                            <p className="text-sm text-muted-foreground">{Dispositivo.descriptionDispositivo}</p>
                        </div>
                    </div>
                </CardDescription>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto gap-5">
                    <ConsumoActualID
                        consumo={Dispositivo.ultimaMedicion}
                        nombreDispositivo={Dispositivo.nombreDispositivo}
                        preciokwh={
                            costoElectricidad === 0 ? "Cargando..." :
                            costoElectricidad === -1 ? "Error" :
                            (costoElectricidad * +Dispositivo.ultimaMedicion.slice(0,-3)/ 1000).toFixed(2)
                        }
                        precioTransporteElectricidad={
                            costoTransporte === 0 ? "Cargando..." :
                            costoTransporte === -1 ? "Error" :
                            (costoTransporte * +Dispositivo.ultimaMedicion.slice(0,-3)/ 1000).toFixed(2)
                        }

                    />
                    <MedidorGaugeID
                        consumo={+Dispositivo.ultimaMedicion.slice(0,-3)} //con esto se quita el del string KWh y el string se castea a numero
                        nombreDispositivo={Dispositivo.nombreDispositivo}
                        limite = {500}
                        color = {Dispositivo.color}
                        fecha={Dispositivo.ultimaConexion}
                    />
                    <GraficoConsumoMensualID
                        color={Dispositivo.color}
                        nombreDispositivo={Dispositivo.nombreDispositivo}
                        consumoActual={+Dispositivo.ultimaMedicion.slice(0,-3)}
                        datos={consumoDataMensual}
                        className="col-span-1 sm:col-span-1 md:col-span-2 xl:col-span-1"
                    />
                    <GraficoConsumoDiarioID
                        color={Dispositivo.color}
                        nombreDispositivo={Dispositivo.nombreDispositivo}
                        consumoActual={+Dispositivo.ultimaMedicion.slice(0,-3)}
                        datos={consumodatos24Horas}
                        className="col-span-1 sm:col-span-1 md:col-span-2 xl:col-span-3"
                    />
                    <ConfiguracionDispositivo
                        nombreInicial = {Dispositivo.nombreDispositivo}
                        descripcionInicial = {Dispositivo.descriptionDispositivo}
                        limiteMensualInicial= {700}
                        limiteDiarioInicial = {50}
                        limiteConstanteInicial = {100}
                        limiteMensualActivado = {true}
                        limiteDiarioActivado = {true}
                        limiteConstanteActivado = {true}
                        onGuardar={(data) => console.log(data)}
                        className="col-span-1 sm:col-span-1 md:col-span-2 xl:col-span-3"
                    />
                </div>
            </div>
        </CardContent>
        <Command />
    </Card>
    </>

    );


}