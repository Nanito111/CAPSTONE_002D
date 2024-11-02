"use client";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddressInput } from "@/components/auth/RegisterInputs/AddressInput";
import { CorreoInput } from "@/components/auth/RegisterInputs/CorreoInput ";
import { NamesInput } from "@/components/auth/RegisterInputs/NamesInput";
import { PasswordInputs } from "@/components/auth/RegisterInputs/PasswordInput";
import { AddressSelector } from "@/components/auth/RegisterInputs/AddressSelector";
import { NumAddressInput } from "@/components/auth/RegisterInputs/NumAddressInput";
import Image from "next/image";

export function RegisterForm() {
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
          <CorreoInput />
          <NamesInput
            tipoNombre="nombre"
            placeholder="Juanito"
            required={true}
          />
          <NamesInput
            tipoNombre="apellido"
            placeholder="Perez"
            required={true}
          />
          <NamesInput
            tipoNombre="segundo apellido"
            placeholder="Martinez"
            required={true}
          />
          <PasswordInputs/>
          <AddressSelector />
          <AddressInput />
          <NumAddressInput />
        </CardContent>
        <CardFooter className="flex flex-col w-full">
          <Button className="w-full mb-2">Registrarse</Button>
        </CardFooter>
      </Card>
    </>
  );
}