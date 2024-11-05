"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle } from "lucide-react";

interface NamesInputProps {
  tipoNombre: string;
  placeholder: string;
  required: boolean;
}

export function NamesInput({ tipoNombre, placeholder, required}: NamesInputProps) {
  const [inputIsValid, setInputIsValid] = useState(0);
  const tipoNombreCapitalized = tipoNombre.charAt(0).toUpperCase() + tipoNombre.slice(1);

  const handleTipoNombreBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const valor = event.target.value;
    const regex = /^[a-zA-ZñÑ]+$/;
    setInputIsValid(regex.test(valor) ? 1 : (required || valor !== "") ? 2 : 0);
  }

  return (
    <TooltipProvider>
      <div className="grid gap-2">
        <Label htmlFor={tipoNombre}>{tipoNombreCapitalized}</Label>
        <div className="relative">
          <Input
            id={tipoNombre}
            type="text"
            placeholder={placeholder}
            onBlur={handleTipoNombreBlur}
            required={required}
            className={inputIsValid === 2 ? "pr-10 border-red-500" : ""}
          />
          {inputIsValid !== 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {inputIsValid === 1 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {inputIsValid === 1 ? (
                  <p>{tipoNombreCapitalized} válido</p>
                ) : (
                  <p>{tipoNombreCapitalized} inválido</p>
                )}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}