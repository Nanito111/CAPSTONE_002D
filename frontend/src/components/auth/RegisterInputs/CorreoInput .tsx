"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function CorreoInput() {
  const [inputIsValid, setInputIsValid] = useState(0);

  const handleCorreoBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const correo = event.target.value;
    const regexCorreo = /\S+@\S+\.\S+/;
    setInputIsValid(regexCorreo.test(correo) ? 1 : 2);
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
      id="email"
      type="email"
      placeholder="correo@ejemplo.com"
      required
      onBlur={handleCorreoBlur}
      />
      {inputIsValid === 1 && <p className="text-sm text-green-500">Correo válido</p>}
      {inputIsValid === 2 && <p className="text-sm text-red-500">Correo inválido</p>}
    </div>
  );
}