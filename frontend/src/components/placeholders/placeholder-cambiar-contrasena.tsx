"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [email,setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [newPasswordErrors, setNewPasswordErrors] = useState<string[]>([])
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [isFormValid, setIsFormValid] = useState(false)

  const validatePassword = (password: string) => {
    const errors: string[] = []
    if (password.length < 8) errors.push("Al menos 8 caracteres")
    if (!/\d/.test(password)) errors.push("Al menos un número")
    if (!/[a-z]/.test(password)) errors.push("Al menos una letra minúscula")
    if (!/[A-Z]/.test(password)) errors.push("Al menos una letra mayúscula")
    if (!/[^a-zA-Z0-9]/.test(password)) errors.push("Al menos un símbolo")
    return errors
  }

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    setNewPassword(password)
    setNewPasswordErrors(validatePassword(password))
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPwd = e.target.value
    setConfirmPassword(confirmPwd)
    setConfirmPasswordError(confirmPwd !== newPassword ? "Las contraseñas no coinciden" : "")
  }

  useEffect(() => {
    const isCurrentPasswordValid = currentPassword.length > 0
    const isNewPasswordValid = newPasswordErrors.length === 0 && newPassword.length > 0
    const isConfirmPasswordValid = confirmPasswordError === "" && confirmPassword.length > 0
    setIsFormValid(isCurrentPasswordValid && isNewPasswordValid && isConfirmPasswordValid)
  }, [currentPassword, newPassword, confirmPassword, newPasswordErrors, confirmPasswordError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) {
      setError("Por favor, corrige los errores antes de enviar")
      return
    }
    setLoading(true)
    setError("")

    try {
      // conseguir email del usuario
      // obtener currentPassword del input
      // hacer peticion a iniciar sesion para validar que estas sean las credenciales correctas, si no, error
      // si son correctas, hacer peticion a cambiar contraseña con contraseña nueva y cookie de sesion
      // si la contraseña se cambia con exito, mostrar mensaje de exito

      // conseguir email del usuario
      const apiUrlUserData = `/api/utils/get-user-data`
      const responseUserData = await fetch(apiUrlUserData, {
        method: 'GET'
      })
      if (responseUserData.ok) {
        const data = await responseUserData.json()
        console.log(data)
        setEmail(data.user.email)
      } else {
        console.error("API user data response not OK")
        throw new Error("API user data response not OK")
      }

      // hacer peticion para iniciar sesión
      const apiUrlLogin = `/api/account/authenticate`
      console.log(email)
      const responseLogin = await fetch(apiUrlLogin,{
        method : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "username": email,
          "password": currentPassword,
          "grant_type": "password"
        })
      })
      if(!responseLogin.ok){
        console.error("API login response not OK")
        throw new Error("API login response not OK")
      }
      // hacer peticion para cambiar contraseña
      const apiUrlChangePassword = '/api/account/change-password'
      const responseChangePassword = await fetch(apiUrlChangePassword,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "new_password": newPassword
        })
      })
      if (!responseChangePassword.ok) {
        console.error("API change password response not OK")
        throw new Error("API change password response not OK")
      }


      // Cambio exitoso
      setSuccess("Tu contraseña ha sido cambiada exitosamente")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setNewPasswordErrors([])
      setConfirmPasswordError("")
    } catch (err) {
      setError("Hubo un error al cambiar la contraseña. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const getInputClassName = (value: string, errors: string[] | string) => {
    if (value === "") return ""
    if (Array.isArray(errors) ? errors.length > 0 : errors !== "") return "border-red-500"
    return "border-green-500"
  }

  return (
    <Card className="w-full max-w-sm mx-auto mt-6">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Cambiar contraseña</CardTitle>
        <CardDescription>Ingresa tu contraseña actual y la nueva contraseña</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className={getInputClassName(currentPassword, [])}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Contraseña nueva</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
                className={getInputClassName(newPassword, newPasswordErrors)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {newPasswordErrors.length > 0 && (
              <ul className="text-sm text-red-500 list-disc list-inside">
                {newPasswordErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Repetir contraseña nueva</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                className={getInputClassName(confirmPassword, confirmPasswordError)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {confirmPasswordError && <p className="text-sm text-red-500">{confirmPasswordError}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={!isFormValid || loading}>
            {loading ? "Cambiando..." : "Cambiar contraseña"}
          </Button>
        </form>
        {loading && <LoaderCircle className="mx-auto mt-4 animate-spin" size={32} />}
        {success && (
          <Alert className="mt-4">
            <AlertTitle>¡Éxito!</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}