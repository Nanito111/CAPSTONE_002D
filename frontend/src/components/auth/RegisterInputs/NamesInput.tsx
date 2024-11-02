"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface NamesInputProps {
    tipoNombre: string;
    placeholder: string;
    required: boolean;
  }

export function NamesInput({ tipoNombre, placeholder, required}: NamesInputProps) {
    const [inputIsValid,setInputIsValid] = useState(0);
    const tipoNombreCapitalized = tipoNombre.charAt(0).toUpperCase() + tipoNombre.slice(1)

    const handleTipoNombreBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const valor = event.target.value;
        const regex = /^[a-zA-Z]+$/;
        setInputIsValid(regex.test(valor) ? 1 : (required || valor !== "") ? 2 : 0);
    }

    return(
    <div className="grid gap-2">
      <Label htmlFor={tipoNombre}>{tipoNombreCapitalized}</Label>
      <Input
      id={tipoNombre}
      type="text"
      placeholder={placeholder}
      onBlur={handleTipoNombreBlur}
      required={required}
      />
      {inputIsValid === 1 && <p className="text-sm text-green-500">{tipoNombreCapitalized} válido</p>}
      {inputIsValid === 2 && <p className="text-sm text-red-500">{tipoNombreCapitalized} inválido</p>}
    </div>
  );
}