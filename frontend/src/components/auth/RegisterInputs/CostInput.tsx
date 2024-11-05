"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle, CircleDollarSign, Zap } from "lucide-react";

interface CostInputProps {
  tipoCosto: string;
  placeholder: string;
  onValueChange?: (value: number) => void;  // Hacemos esta prop opcional
}

export function CostInput({ tipoCosto, placeholder, onValueChange }: CostInputProps) {
  const [inputIsValid, setInputIsValid] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const tipoCostoCapitalized = tipoCosto.charAt(0).toUpperCase() + tipoCosto.slice(1);

  const handletipoCostoBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const valor = event.target.value;
    const regex = /^[0-9]+(\.[0-9]+)?$/;
    setInputIsValid(regex.test(valor) ? 1 : (valor !== "") ? 2 : 0);
  }

  const handleNumericInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numAddress = event.target.value;
    const regexNumAddress = /^[0-9]+(\.[0-9]+)?$/;
    if (!regexNumAddress.test(numAddress) && numAddress !== "") {
      return;
    }
    setInputValue(numAddress);
    setInputIsValid(regexNumAddress.test(numAddress) && numAddress !== "" ? 1 : 2);

    if (onValueChange) {
      const numericValue = parseFloat(numAddress);
      if (!isNaN(numericValue)) {
        onValueChange(numericValue);
      }
    }
  }

  const nombreCamelCase = (tipoCosto: string) => {
    const nombre = tipoCosto.split(" ");
    let nombreCapitalized = "";
    nombre.forEach((palabra) => {
      nombreCapitalized += palabra.charAt(0).toUpperCase() + palabra.slice(1);
    });
    return nombreCapitalized;
  }

  return (
    <TooltipProvider>
      <div className="grid gap-2">
        <Label htmlFor={nombreCamelCase(tipoCosto)}>{tipoCostoCapitalized}</Label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            {
              tipoCosto.startsWith("Costo") ? <CircleDollarSign className="h-5 w-5" /> : <Zap className="h-5 w-5"/>
            }
          </span>
          <Input
            id={nombreCamelCase(tipoCosto)}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onBlur={handletipoCostoBlur}
            onChange={handleNumericInputChange}
            className={inputIsValid === 2 ? "pr-10 border-red-500 pl-10" : "pl-10"}
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
                  <p>{tipoCostoCapitalized} válido</p>
                ) : (
                  <p>{tipoCostoCapitalized} inválido</p>
                )}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}