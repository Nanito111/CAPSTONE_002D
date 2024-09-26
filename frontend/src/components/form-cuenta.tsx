"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Eye, EyeOff, CircleDollarSign } from 'lucide-react'

export default function FormCuenta() {
  const [editando, setEditando] = useState(false)
  const [password, setPassword] = useState('$3cR3tP@$$w0rd')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false)
  const [valorKWh,setValorKWh] = useState("0")

  const validarClave = (pass: string) => {
    const LongitudMinima = 8
    const tieneUppercase = /[A-Z]/.test(pass)
    const tieneLowerCase = /[a-z]/.test(pass)
    const tieneNumeros = /\d/.test(pass)
    const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass)

    if (pass.length < LongitudMinima) {
      return "La contraseña debe tener al menos 8 caracteres"
    }
    if (!tieneUppercase || !tieneLowerCase) {
      return "La contraseña debe contener mayúsculas y minúsculas"
    }
    if (!tieneNumeros) {
      return "La contraseña debe contener al menos un número"
    }
    if (!tieneCaracterEspecial) {
      return "La contraseña debe contener al menos un carácter especial"
    }
    return ""
  }

  useEffect(() => {
    if (editando) {
      setPasswordError(validarClave(password))
      setPasswordMatch(password === confirmarPassword)
    }
  }, [password, confirmarPassword, editando])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Logica de envio formulario
    setEditando(false)
  }

  const handleKWhChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setValorKWh(value);
    }
  };

  const esFormularioValido = !passwordError && passwordMatch && editando

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
            <Input id="first-name" type="text" disabled={!editando} className="mt-1" value="John"/>
          </div>
          <div>
            <Label htmlFor="last-name">Apellidos</Label>
            <Input id="last-name" type="text" disabled={!editando} className="mt-1" value="Titor"/>
          </div>
        </div>
        <div>
          <Label htmlFor="email">Correo</Label>
          <Input id="email" type="email" disabled={!editando} className="mt-1" value="johntitor@enerymeter.com"/>
        </div>
        <div>
          <Label htmlFor="phone">Número de teléfono</Label>
          <Input id="phone" type="tel" disabled={!editando} className="mt-1" value="+56 9 3432 6143"/>
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={mostrarPassword ? "text" : "password"}
              disabled={!editando}
              className="mt-1 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              disabled={!editando}
            >
              {mostrarPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
            </button>
          </div>
          {editando && passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirmar contraseña</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={mostrarConfirmarPassword ? "text" : "password"}
              disabled={!editando}
              className="mt-1 pr-10"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
              disabled={!editando}
            >
              {mostrarConfirmarPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
            </button>
          </div>
          {editando && !passwordMatch && <p className="text-red-500 text-sm mt-1">Las contraseñas no coinciden</p>}
        </div>
        <div>
        <Label htmlFor="KWh-value">Valor $ KW/h </Label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <CircleDollarSign />
          </span>
          <Input
            id="KWh-value"
            type="text"
            disabled={!editando}
            className="pl-10"
            value={valorKWh}
            onChange={handleKWhChange}
          />
        </div>
      </div>
        <div>
          <Label htmlFor="address">Dirección</Label>
          <Textarea id="address" disabled={!editando} className="mt-1" value="Calle falsa 123"/>
        </div>
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <Button type="button" variant="outline" onClick={() => setEditando(!editando)}>
            {editando ? 'Cancelar' : 'Modificar'}
          </Button>
          <Button type="submit" disabled={!esFormularioValido}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  )
}