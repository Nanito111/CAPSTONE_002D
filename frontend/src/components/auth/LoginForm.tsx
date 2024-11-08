"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormEvent, useState } from "react";
import FooterButtons from "@/components/auth/FooterButtons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import Image from "next/image";

export function LoginForm() {
  const [errorLogin, setErrorLogin] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const router = useRouter();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const response = await fetch("/api/account/authenticate", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(
        {
          "username":email,
          "password":password,
          "grant_type":"password"
        }),
    });
    if (response.ok) {
      router.push("/dashboard");
    } else {
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const data = await response.json();
        if (response.status === 401) {
          setTitulo("Credenciales incorrectas");
          setDescripcion("El email o la contraseña son incorrectos " + response.status);
        } else if (response.status === 404) {
          setTitulo("Usuario no encontrado");
          setDescripcion("El usuario con el email proporcionado no existe " + response.status);
        } else if (response.status === 500) {
          setTitulo("Error interno del servidor");
          setDescripcion("El servidor no pudo procesar la solicitud " + response.status);
        } else {
          setTitulo("Error desconocido");
          setDescripcion("Ocurrió un error inesperado " + response.status);
        }
        console.log(`data status: ${response.status}`)
        setErrorLogin(true);
    }
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-sm">
          <Image
            src="/icon-128x128.png"
            alt="Logo"
            width={64}
            height={64}
            className="mx-auto mt-5 hover:scale-110 transform transition-transform duration-500"
          />
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Iniciar Sesión
            </CardTitle>
            <CardDescription>
              Ingresa tu email para entrar a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                // onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="********"
                required
              />
            </div>
          </CardContent>
          <FooterButtons textoBotonPrincipal="Iniciar Sesión" />
        </Card>
      </form>
      {errorLogin && (
        <Alert variant="destructive" className="w-full max-w-sm mt-10 max-2xl:">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{titulo}</AlertTitle>
          <AlertDescription>{descripcion}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
