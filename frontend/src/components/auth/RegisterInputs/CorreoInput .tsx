"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle } from "lucide-react";

export function CorreoInput() {
  const [inputIsValid, setInputIsValid] = useState(0);

  const handleCorreoBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const correo = event.target.value;
    const regexCorreo = /\S+@\S+\.\S+/;
    setInputIsValid(regexCorreo.test(correo) ? 1 : 2);
  }

  return (
    <TooltipProvider>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            required
            onBlur={handleCorreoBlur}
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
                  <p>Correo válido</p>
                ) : (
                  <p>Correo inválido</p>
                )}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}