import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import GoogleIcon from "@/components/ui/svg/google-icon";

export function LoginForm() {
  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
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
              placeholder="correo@ejemplo.com"
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
        </CardContent>
        <CardFooter>
          <Button className="w-full">Iniciar sesión</Button>
          <Separator />
            <Button className="flex w-full">
              <GoogleIcon />
              <p className="ml-2">Iniciar sesión con Google</p>
            </Button>
        </CardFooter>
      </Card>
    </>
  );
}
