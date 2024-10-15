import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import FooterButtons from "@/components/auth/FooterButtons";

export function RegisterForm(
) {
  return (
    <>
      <Card className="w-full max-w-sm">
      <Image
        src="/icon-128x128.png"
        alt="Logo"
        width={64}
        height={64}
        className="mx-auto mt-5 hover:scale-110 transform transition-transform duration-500"
      />
        <CardHeader>
          <CardTitle className="text-2xl">Registrarse</CardTitle>
          <CardDescription>
            Registrate para poder Iniciar sesión
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              type="text"
              placeholder="Juanito Perez"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="repeatpassword">Repetir contraseña</Label>
            <Input
              id="repeatpassword"
              type="password"
              placeholder="********"
              required
            />
          </div>
        </CardContent>
        <FooterButtons textoBotonPrincipal="Registrarse" />

      </Card>
    </>
  );
}
