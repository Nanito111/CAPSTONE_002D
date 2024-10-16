"use client"
import { Command } from "@/components/ui/command";
import { Card, CardContent } from "@/components/ui/card";
import CardDispositivo from "@/components/card-dispositivo";
import { Microchip } from "lucide-react";


// TODO: Cambiar el array de dispositivos por una llamada a la API cuando el backend este listo.
const Dispositivos = [
  // Ejemplo de datos
  {
    // idDispositivo: Math.trunc(Math.random() * (5000-1000) + 1000),
    idDispositivo: 1,
    nombreDispositivo: "Dispositivo 1",
    descriptionDispositivo: "Descripcion del dispositivo 1",
    statusDispositivo: "Inactivo",
    ultimaConexion: new Date().toLocaleDateString(),
    fechaCreacion: "12/12/2021",
    ultimaMedicion: Math.trunc(Math.random() * (999-10) + 10) + "KWh",
    color: "--device-1", // Ejemplo de color en @/globals.css
    svg: Microchip,
  },
  {
    // idDispositivo: Math.trunc(Math.random() * (5000-1000) + 1000),
    idDispositivo: 2,
    nombreDispositivo: "Dispositivo 2",
    descriptionDispositivo: "Descripcion del dispositivo 2",
    statusDispositivo: "Activo",
    ultimaConexion: new Date().toLocaleDateString(),
    fechaCreacion: "12/12/2021",
    ultimaMedicion: Math.trunc(Math.random() * (999-10) + 10) + "KWh",
    color: "--device-2",
    svg: Microchip,
  },
  {
    // idDispositivo: Math.trunc(Math.random() * (5000-1000) + 1000),
    idDispositivo: 3,
    nombreDispositivo: "Dispositivo 3",
    descriptionDispositivo: "Descripcion del dispositivo 3",
    statusDispositivo: "Inactivo",
    ultimaConexion: new Date().toLocaleDateString(),
    fechaCreacion: "12/12/2021",
    ultimaMedicion: Math.trunc(Math.random() * (999-10) + 10) + "KWh",
    color: "--device-3",
    svg: Microchip,
  },
  {
    // idDispositivo: Math.trunc(Math.random() * (5000-1000) + 1000),
    idDispositivo: 4,
    nombreDispositivo: "Dispositivo 4",
    descriptionDispositivo: "Descripcion del dispositivo 4",
    statusDispositivo: "Activo",
    ultimaConexion: new Date().toLocaleDateString(),
    fechaCreacion: "12/12/2021",
    ultimaMedicion: Math.trunc(Math.random() * (999-10) + 10) + "KWh",
    color: "--device-4",
    svg: Microchip,
  },
  {
    // idDispositivo: Math.trunc(Math.random() * (5000-1000) + 1000),
    idDispositivo: 5,
    nombreDispositivo: "Dispositivo 5",
    descriptionDispositivo: "Descripcion del dispositivo 5",
    statusDispositivo: "Activo",
    ultimaConexion: new Date().toLocaleDateString(),
    fechaCreacion: "12/12/2021",
    ultimaMedicion: Math.trunc(Math.random() * (999-10) + 10) + "KWh",
    color: "--device-5",
    svg: Microchip,
  },
  // {
    // idDispositivo: Math.trunc(Math.random() * (5000-1000) + 1000),
  //   nombreDispositivo: "Dispositivo 6",
  //   descriptionDispositivo: "Descripcion del dispositivo 6",
  //   statusDispositivo: "Activo",
  //   ultimaConexion: new Date().toLocaleDateString(),
  //   fechaCreacion: "12/12/2021",
  //   ultimaMedicion: Math.trunc(Math.random() * (999-10) + 10) + "KWh",
  //   color: "--device-6",
  //   svg: Microchip,
  // },
]


export default function PlaceholderContent() {
  return (
    <Card className="rounded-lg border-none mt-6 w-full">
      <CardContent className="p-6">
        <div className="min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
            <h1 className="m-3 font-bold">Adminstrador de dispostivos</h1>
            <div
            className={Dispositivos.length === 0 ?
              'flex justify-center mt-[10%]' : // Si no hay dispositivos, centrar el mensaje
              'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mx-auto gap-5'}>
              <CardDispositivo
                Dispositivos={Dispositivos}
              />
            </div>
        </div>
      </CardContent>
    <Command/>
    </Card>

  );
}