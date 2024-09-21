"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function FormCuenta() {
  const [editando, setEditando] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(true)

  const validarClave = (pass: string) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(pass)
    const hasLowerCase = /[a-z]/.test(pass)
    const hasNumbers = /\d/.test(pass)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass)

    if (pass.length < minLength) {
      return "La contraseña debe tener al menos 8 caracteres"
    }
    if (!hasUpperCase || !hasLowerCase) {
      return "La contraseña debe contener mayúsculas y minúsculas"
    }
    if (!hasNumbers) {
      return "La contraseña debe contener al menos un número"
    }
    if (!hasSpecialChar) {
      return "La contraseña debe contener al menos un carácter especial"
    }
    return ""
  }

  useEffect(() => {
    if (editando) {
      setPasswordError(validarClave(password))
      setPasswordMatch(password === confirmPassword)
    }
  }, [password, confirmPassword, editando])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Logica de envio formulario
    setEditando(false)
  }

  const isFormValid = !passwordError && passwordMatch && editando

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="profile-photo">Foto de perfil</Label>
          <Input id="profile-photo" type="file" accept="image/*" disabled={!editando} className="mt-1" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first-name">Nombre</Label>
            <Input id="first-name" type="text" disabled={!editando} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="last-name">Apellidos</Label>
            <Input id="last-name" type="text" disabled={!editando} className="mt-1" />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Correo</Label>
          <Input id="email" type="email" disabled={!editando} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="phone">Número de teléfono</Label>
          <Input id="phone" type="tel" disabled={!editando} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            disabled={!editando}
            className="mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {editando && passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirmar contraseña</Label>
          <Input
            id="confirm-password"
            type="password"
            disabled={!editando}
            className="mt-1"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {editando && !passwordMatch && <p className="text-red-500 text-sm mt-1">Las contraseñas no coinciden</p>}
        </div>
        <div>
          <Label htmlFor="address">Dirección</Label>
          <Textarea id="address" disabled={!editando} className="mt-1" />
        </div>
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <Button type="button" variant="outline" onClick={() => setEditando(!editando)}>
            {editando ? 'Cancelar' : 'Modificar'}
          </Button>
          <Button type="submit" disabled={!isFormValid}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  )
}