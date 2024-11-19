'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function MoreInfoDialog() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="default">
          Saber más
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Información de nuestro proyecto</DialogTitle>
          <DialogDescription>
            La vision de este proyecto es la de crear un sistema de medicion de energia electrica que permita a los usuarios tener un control mas preciso de su consumo energetico. Buscando generar conciencia sobre el uso de la energia y promover el ahorro de la misma.<br/>
            Esto naciendo bajo la problematica del creciente aumento del costo de la energia electrica en el pais, y la necesidad de un sistema de medicion mas preciso y accesible para los usuario, debido a la poca accesibilidad de los sistemas de medicion actuales, y la falta de informacion detallada sobre el consumo energetico de los usuarios, lo que dificulta la toma de decisiones sobre el uso de la energia.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}