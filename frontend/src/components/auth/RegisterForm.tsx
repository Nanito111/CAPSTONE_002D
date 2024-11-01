"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";
import FooterButtons from "@/components/auth/FooterButtons";

export function RegisterForm() {
  const [mensajeAddress, setMensajeAddress] = useState("");
  const [mensajeColor, setMensajeColor] = useState("");

  const handleAddressFocus = (event: React.FocusEvent<HTMLInputElement>) => {
  };
  const handleAddressBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const direccion = event.target.value;
    // hacer peticion a api con la direccion ingresada
    const api = `https://nominatim.openstreetmap.org/search?street=${direccion}&format=json`;
    console.log(api);
    fetch(api)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setMensajeAddress(`Dirección encontrada`);
          setMensajeColor("text-green-500");
        } else {
          setMensajeAddress("Dirección no encontrada");
          setMensajeColor("text-red-500");
        }
      });
  };

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
          <div className="grid gap-2">
          <Label htmlFor="street">Calle</Label>
            <Input
              id="street"
              type="text"
              placeholder="Avenida Esquina Blanca"
              required
              onFocus={handleAddressFocus}
              onBlur={handleAddressBlur}
            />
            <p 
              className={`text-sm ${mensajeColor}`}
            >{mensajeAddress}</p>
          </div>
          <div className="grid gap-2">
          <Label htmlFor="streetnumber">Numero de calle</Label>
            <Input
              id="streetnumber"
              type="text"
              placeholder="501"
              required
            />
          </div>
          <div className="grid gap-2">
          <Label htmlFor="comuna">Comuna</Label>
            <Input
              id="comuna"
              type="text"
              placeholder="Maipú"
              required
            />
          </div>
          <div className="grid gap-2">
          <Label htmlFor="region">Región</Label>
            <Input
              id="Region"
              type="text"
              placeholder="Metropolitana"
              required
            />
          </div>
          <div className="grid gap-2">
          <Label htmlFor="country">País</Label>
            <Input
              id="country"
              type="text"
              placeholder="Chile"
              required
            />
          </div>
        </CardContent>
          <FooterButtons textoBotonPrincipal="Registrarse" />
      </Card>
    </>
  );
}
