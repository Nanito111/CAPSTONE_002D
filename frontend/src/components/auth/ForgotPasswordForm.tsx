"use client";

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
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import FooterButtons  from "@/components/auth/FooterButtons";
import Image from "next/image";


export function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [classInput, setClassInput] = useState("");

    const regexCorreo = /\S+@\S+\.\S+/;

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        setClassInput("");

        if (!email) {
            setError("El email es requerido");
            setLoading(false);
            return;
        }

        const response = await fetch("/api/account/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        setClassInput("border-red-500 focus:ring-red-500 focus:border-red-500");
        if (!regexCorreo.test(email)) {
            setError("El email no es válido");
        }
        else if (response.ok) {
            setError("")
            setEmail("");
            setSuccess("Se ha enviado un email con las instrucciones para recuperar tu contraseña");
            setClassInput("border-green-500 focus:ring-green-500 focus:border-green-500");
        }
        else if (response.status === 404) {
            setError("El email no se encuentra registrado");
        }
        else if(response.status === 422){
            setError("Error de validación");
        }
        else if (response.status === 500) {
            setError("Error en el servidor");
        }
        else if (response.status === 501) {
            setError("Error interno en el servidor");
        }
        setLoading(false);
    };
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
                Ingresa tu email para recuperar tu contraseña
            </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                name="email"
                placeholder="correo@ejemplo.com"
                required
                className={classInput}
                onChange={handleEmailChange}
                />
            </div>
            </CardContent>
            <FooterButtons textoBotonPrincipal="Solicitar cambio contraseña" />
        </Card>
        </form>
        {
            loading && <LoaderCircleIcon className="mx-auto mt-5 transition animate-spin" size={64} />
        }
        {
            // mensaje solicitud
            success ?
            <Alert className="w-full max-w-sm mt-10 max-2xl">
                <AlertTitle>¡Solicitud enviada!</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
            </Alert>
            : error &&
            <Alert variant="destructive" className="w-full max-w-sm mt-10 max-2xl">
                <AlertTitle>¡Error!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>

        }
    </>
    );
}

