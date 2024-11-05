"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle } from "lucide-react";

export function PasswordInputs() {
  const [passInputIsValid, setPassInputIsValid] = useState(0);
  const [repeatPassInputIsValid, setRepeatPassInputIsValid] = useState(0);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handlePasswordBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const password = event.target.value;
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    setPassInputIsValid(regexPassword.test(password) ? 1 : 2);

    const errors: string[] = [];
    if (password.length < 8) errors.push("La contraseña debe tener al menos 8 caracteres");
    if (!/[0-9]/.test(password)) errors.push("La contraseña debe tener al menos un número");
    if (!/[a-z]/.test(password)) errors.push("La contraseña debe tener al menos una letra minúscula");
    if (!/[A-Z]/.test(password)) errors.push("La contraseña debe tener al menos una letra mayúscula");
    if (!/[@$!%*?&]/.test(password)) errors.push("La contraseña debe tener al menos un símbolo");

    setErrorMessages(errors);
  };

  const handleRepeatPasswordBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const passwordElement = document.getElementById("password") as HTMLInputElement | null;
    const password = passwordElement ? passwordElement.value : "";
    const repeatedPassword = event.target.value;
    setRepeatPassInputIsValid(password === repeatedPassword ? 1 : 2);
  };

  return (
    <TooltipProvider>
      <div className="grid gap-4">
        <div className="relative">
          <Label htmlFor="password">Contraseña</Label>
          <div className="flex items-center">
            <Input
              id="password"
              type="password"
              placeholder="******** (letras y números)"
              required
              onBlur={handlePasswordBlur}
              className={passInputIsValid === 2 ? "pr-10 border-red-500" : ""}
            />
            {passInputIsValid !== 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute right-3 top-[32px]">
                    {passInputIsValid === 1 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {passInputIsValid === 1 ? (
                    <p>Contraseña válida</p>
                  ) : (
                    <ul className="list-disc pl-4">
                      {errorMessages.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  )}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        <div className="relative">
          <Label htmlFor="repeatpassword">Repetir contraseña</Label>
          <div className="flex items-center">
            <Input
              id="repeatpassword"
              type="password"
              placeholder="******** (letras y números)"
              required
              onBlur={handleRepeatPasswordBlur}
              className={repeatPassInputIsValid === 2 ? "pr-10 border-red-500" : ""}
            />
            {repeatPassInputIsValid !== 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute right-3 top-[32px]">
                    {repeatPassInputIsValid === 1 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {repeatPassInputIsValid === 1 ? (
                    <p>Las contraseñas coinciden</p>
                  ) : (
                    <p>Las contraseñas no coinciden</p>
                  )}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}