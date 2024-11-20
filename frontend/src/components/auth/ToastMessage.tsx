"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ToastMessageProps {
  httpStatus: number;
}

const toastMessages = {
  1: {
    title: "Procesando solicitud...",
    description: "Creando cuenta...",
    variant: "info",
    altText: "",
    href: "",
  },
  200: {
    title: "¡Cuenta creada!.",
    description: "Tu cuenta ha sido creada con exito.",
    variant: "success",
    altText: "Iniciar sesión",
    href: "/login",
  },
  409: {
    title: "Error al crear cuenta.",
    description: "El correo electrónico ya está en uso.",
    variant: "warning",
    altText: "Iniciar sesión",
    href: "/login"
  },
  500: {
    title: "Error interno del servidor.",
    description: "Un error inesperado ha ocurrido.",
    variant: "destructive",
    altText: "Intenta de nuevo",
  },
  default: {
    title: "Error interno del servidor.",
    description: "Un error inesperado ha ocurrido.",
    variant: "destructive",
    altText: "Intenta de nuevo",
  },
};

export function ToastRegister({ httpStatus }: ToastMessageProps) {
  const { toast } = useToast();
  const message = toastMessages[httpStatus] || toastMessages.default;

  return (
    <Button
      onClick={() => {
        toast({
          variant: message.variant,
          title: message.title,
          description: message.description,
          action: <Link href={message.href}>{message.altText}</Link>,
        });
      }}
      className="w-full max-w-xs"
    >
      Registrarse
    </Button>
  );
}
