"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"

const FormSchema = z.object({
  notificacionesSMS: z.boolean().default(false).optional(),
  notificacionesEmail: z.boolean().default(false).optional(),
  notificacionesPush: z.boolean().default(false).optional(),
  notificacionesWhatsapp: z.boolean().default(false).optional(),

})

interface ValoresFormulario {
  name: string
  label: string
  descripcion: string
}

const valoresFormulario: ValoresFormulario[] = [
  {
    name: "notificacionesSMS",
    label: "Recibir notificaciones del consumo mediante SMS",
    descripcion: "Se aplicarán cargos adicionales por el servicio de SMS. Se utilizara el numero registrado en el sistema",
  },
  {
    name: "notificacionesEmail",
    label: "Recibir notificaciones del consumo mediante email",
    descripcion: "Se utilizara el correo registrado en el sistema.",
  },
  {
    name: "notificacionesPush",
    label: "Recibir notificaciones del consumo mediante notificaciones push",
    descripcion: "Se utilizara la aplicacion movil para enviar notificaciones push.",
  },
  {
    name: "notificacionesWhatsapp",
    label: "Recibir notificaciones del consumo mediante mensajes de Whatsapp",
    descripcion: "Se utilizara el numero registrado en el sistema",
  }
]


export default function FormularioNotificaciones() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      notificacionesSMS: false,
      notificacionesEmail: false,
      notificacionesPush: false,
      notificacionesWhatsapp: false,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {valoresFormulario.map((item, index) => (
        <FormField
          key={index}
          control={form.control}
          name={item.name as keyof z.infer<typeof FormSchema>}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{item.label}</FormLabel>
                <FormDescription>{item.descripcion}</FormDescription>
              </div>
            </FormItem>
          )}
        />
      ))}
      <Button type="submit">Guardar</Button>
    </form>
  </Form>
  )
}
