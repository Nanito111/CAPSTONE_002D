"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Image from "next/image";
import { LoaderCircleIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FooterButtons from "@/components/auth/FooterButtons";

export function RecoverPasswordForm() {
  const params = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [classInputNewPassword, setClassInputNewPassword] = useState("");
  const [classInputRepeatPassword, setClassInputRepeatPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/utils/confirmar-recover-password?token=${params.token}`);
        if (response.ok) {
          setIsValidToken(true);
        } else {
          const errorData = await response.json();
          setTokenError(errorData.message || "Este enlace ya no es válido.");
        }
      } catch (error) {
        setTokenError("Hubo un error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [params.token]);

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("Al menos 8 caracteres");
    if (!/\d/.test(password)) errors.push("Al menos un número");
    if (!/[a-z]/.test(password)) errors.push("Al menos una letra minúscula");
    if (!/[A-Z]/.test(password)) errors.push("Al menos una letra mayúscula");
    if (!/[^a-zA-Z0-9]/.test(password)) errors.push("Al menos un símbolo");
    return errors;
  };

  const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
    const validationErrors = validatePassword(event.target.value);
    setErrors(validationErrors);
    setClassInputNewPassword(validationErrors.length > 0 ? "border-red-500" : "border-green-500");
  };

  const handleRepeatPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
    setClassInputRepeatPassword(event.target.value === newPassword ? "border-green-500" : "border-red-500");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setErrors(["Las contraseñas no coinciden"]);
      setLoading(false);
      return;
    }

    if (errors.length > 0) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/utils/recover-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: params.token,
          newPassword: newPassword,
        }),
      });

      if (response.ok) {
        setSuccess("Tu contraseña ha sido actualizada exitosamente.");
      } else {
        const errorData = await response.json();
        setErrors([errorData.message || "Hubo un error al actualizar la contraseña. "+response.status]);
      }
    } catch (error) {
      setErrors(["Hubo un error al conectar con el servidor."]);
    } finally {
      setLoading(false);
    }
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (loading) {
    return <LoaderCircleIcon className="mx-auto mt-5 transition animate-spin" size={64} />;
  }

  if (!isValidToken) {
    return (
      <Alert variant="destructive" className="w-full max-w-sm mt-10 max-2xl">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{tokenError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-sm">
          <Image
            src="/icon-128x128.png"
            alt="Logo"
            width={64}
            height={64}
            className="mx-auto mt-5 hover:scale-110 transform transition-transform duration-500"
          />
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Recuperar contraseña
            </CardTitle>
            <CardDescription>
              Ingresa tu nueva clave y repítela
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="newpassword">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="newpassword"
                  type={showNewPassword ? "text" : "password"}
                  name="newpassword"
                  placeholder="********"
                  required
                  className={`pr-10 ${classInputNewPassword}`}
                  onChange={handleNewPasswordChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={toggleNewPasswordVisibility}
                >
                  {showNewPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {errors.length > 0 && (
              <ul className="text-sm text-red-500">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
            <div className="grid gap-2">
              <Label htmlFor="repeatPassword">Repetir contraseña</Label>
              <div className="relative">
                <Input
                  id="repeatPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="repeatPassword"
                  placeholder="********"
                  required
                  className={`pr-10 ${classInputRepeatPassword}`}
                  onChange={handleRepeatPasswordChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
          <FooterButtons textoBotonPrincipal="Cambiar contraseña" />
        </Card>
      </form>
      {loading && <LoaderCircleIcon className="mx-auto mt-5 transition animate-spin" size={64} />}
      {success ? (
        <Alert className="w-full max-w-sm mt-10 max-2xl">
          <AlertTitle>Contraseña cambiada con éxito</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      ) : errors.length > 0 && (
        <Alert variant="destructive" className="w-full max-w-sm mt-10 max-2xl">
          <AlertTitle>¡Error!</AlertTitle>
          <AlertDescription>{errors.join(", ")}</AlertDescription>
        </Alert>
      )}
    </>
  );
}