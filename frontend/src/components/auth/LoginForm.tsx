"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Image from "next/image";
import FooterButtons from "@/components/auth/FooterButtons";

import {FormEvent} from 'react';
//import {useRouter} from 'next/compat/router';
// import {useRouter} from 'next/router';
import {useRouter} from 'next/navigation';

import React from "react";



export function LoginForm() {

  const router = useRouter();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    {response.ok ? router.push('/dashboard') : alert('Error al iniciar sesión')}
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
          <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tu email para entrar a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              // onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              name="password"
              // onChange={handleChange}
              placeholder="********"
              required
            />
          </div>
        </CardContent>
        <FooterButtons textoBotonPrincipal="Iniciar Sesión" />
      </Card>
      </form>
    </>
    );
  }