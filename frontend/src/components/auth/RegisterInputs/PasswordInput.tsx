"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function PasswordInputs() {
  const [passInputIsValid, setPassInputIsValid] = useState(0);
  const [repeatPassInputIsValid, setRepeatPassInputIsValid] = useState(0);
  const [errorLongitud, setErrorLongitud] = useState("");
  const [errorNumero, setErrorNumero] = useState("");
  const [errorMinuscula, setErrorMinuscula] = useState("");
  const [errorMayuscula, setErrorMayuscula] = useState("");
  const [errorSimbolo, setErrorSimbolo] = useState("");

  const handlePasswordBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const password = event.target.value;
    const regexPassword =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$$/;
    setPassInputIsValid(regexPassword.test(password) ? 1 : 2);

    password.length < 8 ? setErrorLongitud("La contraseña debe tener al menos 8 caracteres\n") : setErrorLongitud("");
    !/[0-9]/.test(password) ? setErrorNumero("La contraseña debe tener al menos un número\n") : setErrorNumero("");
    !/[a-z]/.test(password) ? setErrorMinuscula("La contraseña debe tener al menos una letra minúscula\n") : setErrorMinuscula("");
    !/[A-Z]/.test(password) ? setErrorMayuscula("La contraseña debe tener al menos una letra mayúscula\n") : setErrorMayuscula("");
    !/[@$!%*?&]/.test(password) ? setErrorSimbolo("La contraseña debe tener al menos un símbolo\n") : setErrorSimbolo("");
  };

  const handleRepeatPasswordBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const passwordElement = document.getElementById("password") as HTMLInputElement | null;
    const password = passwordElement ? passwordElement.value : "";
    const repeatedPassword = event.target.value;
    setRepeatPassInputIsValid(password === repeatedPassword ? 1 : 2);
  };

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          placeholder="******** (letras y numeros)"
          required
          onBlur={handlePasswordBlur}
          />
          {passInputIsValid === 1 && <p className="text-sm text-green-500">Contraseña válida</p>}
          {passInputIsValid === 2 && <p className="text-sm text-red-500">Contraseña inválida</p>}
          {errorLongitud !== "" && <p className="text-sm text-red-300">{errorLongitud}</p>}
          {errorNumero !== "" && <p className="text-sm text-red-300">{errorNumero}</p>}
          {errorMinuscula !== "" && <p className="text-sm text-red-300">{errorMinuscula}</p>}
          {errorMayuscula !== "" && <p className="text-sm text-red-300">{errorMayuscula}</p>}
          {errorSimbolo !== "" && <p className="text-sm text-red-300">{errorSimbolo}</p>}

      </div>
      <div className="grid gap-2">
        <Label htmlFor="repeatpassword">Repetir contraseña</Label>
        <Input
          id="repeatpassword"
          type="password"
          placeholder="******** (letras y numeros)"
          required
          onBlur={handleRepeatPasswordBlur}
        />
          {repeatPassInputIsValid === 1 && <p className="text-sm text-green-500">Las contraseñas coinciden</p>}
          {repeatPassInputIsValid === 2 && <p className="text-sm text-red-500">Las contraseñas no coinciden</p>}
      </div>
    </>
  );
}
