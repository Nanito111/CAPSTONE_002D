import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"

export function HelpForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">¿Problemas con la informacion electrica?</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tranqui!</DialogTitle>
          <DialogDescription>
            Solo debes fijarte en los siguientes valores de tu cuenta cuenta electrica
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
            <Image
                src="/boleta-interior.jpg"
                alt="Boleta"
                width={1485}
                height={1117}
                className="rounded-lg"
            />
        </div>
        <DialogDescription>
            En el apartado de <q>Detalle de mi cuenta</q> encontraras los valores que debes ingresar:<br/><br/>
            <p>- El primero de estos es la <b>Administración de servicio que es de $1326 pesos</b></p>
            <p>- Dos de los valores se encuentran en la segunda fila:<br/><b>Electricidad consumida 225 kWh y su precio de $32393 pesos</b></p>
            <p>- El ultimo valor se encuentra en la tercera fila:<br/><b>Coordinacion y transporte de electricidad de $434 pesos</b></p>
        </DialogDescription>
        <DialogFooter className="sm:justify-start">

          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
