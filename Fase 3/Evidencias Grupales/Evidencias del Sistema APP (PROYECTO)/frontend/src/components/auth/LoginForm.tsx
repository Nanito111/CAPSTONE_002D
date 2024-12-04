"use client";
import Link from "next/link";
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
import { AlertCircle, EyeIcon, EyeOffIcon } from "lucide-react";
import { Loader } from "@/components/loader";
import Image from "next/image";
import { LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";


export function LoginForm() {
  const [cargando, setCargando] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);
  const [logged, setLogged] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const clasesInputError = "border-red-500 focus:ring-red-500 focus:border-red-500";
  const router = useRouter();

  const erasePassword = () =>{
    // Elimina la contraseña del formulario cuando es erronea al momento de enviarse
    const inputPassword = document.getElementById("password") as HTMLInputElement;
    inputPassword.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setErrorLogin(false);
    setCargando(true);
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
      setLogged(true);
      router.push("/dashboard");
    } else {
      setErrorLogin(true);
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        switch (response.status) {
          case 401:
            setTitulo("Credenciales incorrectas");
            setDescripcion("El email o la contraseña son incorrectos " + response.status);
            erasePassword();
            break;
          case 404:
            setTitulo("Usuario no encontrado");
            setDescripcion("El usuario con el email proporcionado no existe " + response.status);
            erasePassword();
            break;
          case 500:
            setTitulo("Error interno del servidor");
            setDescripcion("El servidor no pudo procesar la solicitud " + response.status);
            break;
          default:
            setTitulo("Error desconocido");
            setDescripcion("Ocurrió un error inesperado " + response.status);
            break;
        }
        console.log(`data status: ${response.status}`)    }
    }
    setCargando(false);
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };  

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
                placeholder="correo@ejemplo.com"
                required
                className={errorLogin ? clasesInputError : ""}
              />
            </div>
            <div className="relative grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                required
                className={errorLogin ? clasesInputError : ""}
              />
               <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-[1.4rem]"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
              </Button>
            </div>
            <Link href="/forgot-password">
              <p className="underline text-sm">¿Olvidaste tu contraseña?</p>
            </Link>
          </CardContent>
          <FooterButtons textoBotonPrincipal="Iniciar Sesión" />
        </Card>
      </form>
      {
        // loading animation
        cargando && <Loader/>
      }
      {errorLogin && (
        <Alert variant="destructive" className="w-full max-w-sm mt-10 max-2xl:">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{titulo}</AlertTitle>
          <AlertDescription>{descripcion}</AlertDescription>
        </Alert>
      )}
      {
        // logged animation
        logged && <Alert className="w-full max-w-sm mt-10 max-2xl">
          <LoaderCircleIcon className="h-4 w-4 animate-spin" />
          <AlertTitle>¡Bienvenido!</AlertTitle>
          <AlertDescription>Redirigiendo...</AlertDescription>
        </Alert>
      }
    </>
  );
}
