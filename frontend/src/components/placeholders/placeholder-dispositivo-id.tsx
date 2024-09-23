"use client"
import { Command } from "@/components/ui/command";
import { Card, CardTitle, CardHeader, CardContent, CardDescription, CardFooter} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { Microchip } from "lucide-react";
import { usePathname } from "next/navigation";

import ConsumoActualID from "@/components/charts/GraficoConsumoActualID";
import MedidorGaugeID from  "@/components/charts/MedidorGaugeID";

export default function PlaceholderDispositivoID() {
  const pathname = usePathname();

  // !Esto en el futuro debe cambiar, debido a que debe ser consumido por una API.
  const id = pathname.split('/')[2];
  const status = Math.random() > 0.5 ? "Activo" : "Inactivo";
  const random = Math.floor(Math.random() * 6) + 1; // numero al azar entre 1 y 6 para simular un dispositivo

  const Dispositivo = {
    idDispositivo: id,
    nombreDispositivo: "Dispositivo " + id,
    descriptionDispositivo: "Descripcion del dispositivo " + id,
    statusDispositivo: status,
    ultimaConexion: new Date().toLocaleDateString(),
    fechaCreacion: "12/12/2021",
    ultimaMedicion: Math.trunc(Math.random() * (999-10) + 10) + "KWh",
    color: `--device-${id}`, // Ejemplo de color en @/globals.css
}

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
                {/* <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto gap-5'>
                    <div className="rounded-lg" style={{ color: `var(${Dispositivo.color})` }}>
                        <p>{Dispositivo.nombreDispositivo}</p>
                        <p>{Dispositivo.descriptionDispositivo}</p>
                        <p>{Dispositivo.statusDispositivo}</p>
                        <p>{Dispositivo.ultimaConexion}</p>
                        <p>{Dispositivo.fechaCreacion}</p>
                        <p>{Dispositivo.ultimaMedicion}</p>
                        <p>{Dispositivo.color}</p>
                    </div>
                </div>
                col-span-1 sm:col-span-1 md:col-span-2 xl:grid-cols-3
                */}

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto gap-5">
                    <ConsumoActualID
                        consumo={Dispositivo.ultimaMedicion}
                        nombreDispositivo={Dispositivo.nombreDispositivo}
                    />
                    <MedidorGaugeID
                        consumo={+Dispositivo.ultimaMedicion.slice(0,-3)} //con esto se quita el del string KWh y el string se castea a numero
                        nombreDispositivo={Dispositivo.nombreDispositivo}
                        limite = {700}
                        color = {Dispositivo.color}
                        fecha={Dispositivo.ultimaConexion}
                    />
                </div>
            </div>
        </CardContent>
        <Command />
    </Card>


      <Card className={cn("w-[380px]")}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Push Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Send notifications to device.
            </p>
          </div>
          <Switch />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Check className="mr-2 h-4 w-4" /> Mark all as read
        </Button>
      </CardFooter>
    </Card>
    </>

    );


}