"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { AddressInput } from "@/components/auth/RegisterInputs/AddressInput";
import { CorreoInput } from "@/components/auth/RegisterInputs/CorreoInput ";
import { NamesInput } from "@/components/auth/RegisterInputs/NamesInput";
import { PasswordInputs } from "@/components/auth/RegisterInputs/PasswordInput";
import { AddressSelector } from "@/components/auth/RegisterInputs/AddressSelector";
import { NumAddressInput } from "@/components/auth/RegisterInputs/NumAddressInput";
import { EmpresaInput } from "@/components/auth/RegisterInputs/EmpresaInput";
import { PhoneInput } from "@/components/auth/RegisterInputs/PhoneInput";
import { CostInput } from "@/components/auth/RegisterInputs/CostInput";
import { CostCalculator } from "@/components/auth/RegisterInputs/CostCalculator";
import { HelpForm } from "@/components/auth/HelpForm";
import Image from "next/image";

export function RegisterForm() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <Image
        src="/icon-128x128.png"
        alt="Logo"
        width={64}
        height={64}
        className="mx-auto mt-5 hover:scale-110 transform transition-transform duration-500"
      />
      <CardHeader>
        <CardTitle className="text-2xl text-center">Registrarse</CardTitle>
        <CardDescription className="text-center">
          Registrate para poder Iniciar sesión
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Informacion cuenta */}
          <div className="space-y-4">
            <h3 className="text-lg text-center font-semibold mb-4">Cuenta</h3>
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
            <PasswordInputs />
          </div>
          {/* Informacion contacto */}
          <div className="space-y-4">
            <h3 className="text-lg text-center font-semibold mb-4">Contacto</h3>
            <AddressSelector />
            <AddressInput />
            <NumAddressInput />
            <PhoneInput />
          </div>
          {/* Informacion electrica */}
          <div className="space-y-4">
          <h3 className="text-lg text-center font-semibold mb-4">Información electrica</h3>
          <EmpresaInput />
          <CostInput tipoCosto="Costo administración" placeholder="1000" />
          <CostCalculator/>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center mt-6 gap-2">
        <Button className="w-full max-w-xs">Registrarse</Button>
        <HelpForm />
      </CardFooter>
    </Card>
  );
}