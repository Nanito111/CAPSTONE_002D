"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Eye, EyeOff } from 'lucide-react'

export default function FormCuenta() {
  const [editando, setEditando] = useState(false)
  const [nombre, setNombre] = useState('John')
  const [apellidos, setApellidos] = useState('Titor')
  const [correo, setCorreo] = useState('johntitor@enerymeter.com')
  const [correoError, setCorreoError] = useState('')
  const [telefono, setTelefono] = useState('+56 9 3432 6143')
  const [direccion, setDireccion] = useState('Calle falsa 123')
  const [password, setPassword] = useState('$3cR3tP@$$w0rd')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false)

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

  const validarCorreo = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email) ? "" : "El formato del correo es inválido"
  }

  useEffect(() => {
    if (editando) {
      setPasswordError(validarClave(password))
      setPasswordMatch(password === confirmarPassword)
      setCorreoError(validarCorreo(correo))
    }
  }, [password, confirmarPassword, correo, editando])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Logica de envio formulario
    setEditando(false)
  }

  const esFormularioValido = !passwordError && passwordMatch && !correoError && editando

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first-name">Nombre</Label>
            <Input id="first-name" type="text" disabled={!editando} className="mt-1" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="last-name">Apellidos</Label>
            <Input id="last-name" type="text" disabled={!editando} className="mt-1" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Correo</Label>
          <Input id="email" type="email" disabled={!editando} className="mt-1" value={correo} onChange={(e) => setCorreo(e.target.value)} />
          {editando && correoError && <p className="text-red-500 text-sm mt-1">{correoError}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Número de teléfono</Label>
          <Input id="phone" type="tel" disabled={!editando} className="mt-1" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
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
          <Label htmlFor="address">Dirección</Label>
          <Textarea id="address" disabled={!editando} className="mt-1" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
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