"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  CircleDollarSign,
  EyeIcon,
  EyeOffIcon,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpForm } from "@/components/auth/HelpForm";
import { useState, useEffect } from "react";
import Image from "next/image";

export function RegisterForm() {
  // Estados de validacion (Getters y setters). 0 = no validado, 1 = validado, 2 = invalido
  // Cuenta
  const [CorreoinputIsValid, setCorreoInputIsValid] = useState(0);
  const [NombreInputIsValid, setNombreInputIsValid] = useState(0);
  const [ApellidoInputIsValid, setApellidoInputIsValid] = useState(0);
  const [SegundoApellidoInputIsValid, setSegundoApellidoInputIsValid] = useState(0);
  const [ClaveInputIsValid, setClaveInputIsValid] = useState(0);
  const [RepetirClaveInputIsValid, setRepetirClaveInputIsValid] = useState(0);
  const [MensajesErrorContraseña, setMensajesErrorContraseña] = useState<string[]>([]);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Contacto
  const [TelefonoInputIsValid, setTelefonoInputIsValid] = useState(0);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [selectedPais, setSelectedPais] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedComuna, setSelectedComuna] = useState<string>("");
  const [CalleInputIsValid, setCalleInputIsValid] = useState(0);
  const [NumeroInputIsValid, setNumeroInputIsValid] = useState(0);
  // Electrica
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>("");
  const [CostoAdministracionInputIsValid, setCostoAdministracionInputIsValid] = useState(0);
  const [kWhConsumidosUltimoMesInputIsValid, setkWhConsumidosUltimoMesInputIsValid] = useState(0);
  const [CostoElectricidadUltimoMesInputIsValid, setCostoElectricidadUltimoMesInputIsValid] = useState(0);
  const [CostoTransporteElectricoInputIsValid, setCostoTransporteElectricoInputIsValid] = useState(0);
  const [CostoElectricidadUltimoMes, setCostoElectricidadUltimoMes] = useState<string | null>(null);
  const [kWhConsumidosUltimoMes, setkWhConsumidosUltimoMes] = useState<string | null>(null);
  const [CostoTransporteElectrico, setCostoTransporteElectrico] = useState<string | null>(null);
  const [totalCostkWh, setTotalCostkWh] = useState<number | null>(null);
  const [totalCostTransport, setTotalCostTransport] = useState<number | null>(null);


  const { toast } = useToast()

  // regex
  const regexNombres = /^[a-zA-ZñÑ]+$/;
  const regexCorreo = /\S+@\S+\.\S+/;
  const regexNumerosEnteros = /^[0-9]+$/;
  const regexNumerosDecimales = /^[0-9]+(\.[0-9]+)?$/;

  // Handlers
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const loadingToast = toast({
      title: "Creando cuenta",
      description: "Por favor espere...",
    })

    const formData = {
      user: {
        first_name: (document.getElementById("Nombre") as HTMLInputElement).value,
        last_name: (document.getElementById("Apellido") as HTMLInputElement).value,
        second_last_name: (document.getElementById("SegundoApellido") as HTMLInputElement).value,
        phone_number: Number((document.getElementById("numAddress") as HTMLInputElement).value),
        country_code: '56', // valor hardcodeado
        email: (document.getElementById("email") as HTMLInputElement).value,
        password: (document.getElementById("Clave") as HTMLInputElement).value
      },
      address: {
        street_name: (document.getElementById("Calle") as HTMLInputElement).value,
        street_number: (document.getElementById("Numero") as HTMLInputElement).value,
        comuna: selectedComuna,
        country: selectedPais,
        region: selectedRegion
      },
      contract: {
        electricity_company: selectedEmpresa,
        service_administration_cost: Number((document.getElementById("CostoAdministración") as HTMLInputElement).value),
        // transport_cost: Number((document.getElementById("CostoTransporteElectricoKWh") as HTMLInputElement).value),
        // electricity_cost: Number((document.getElementById("CostoElectricidadkWh") as HTMLInputElement).value)
        electricity_cost: totalCostkWh,
        transport_cost: totalCostTransport,
      }
    };

    try {
      const response = await fetch('/api/account/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      })

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.indexOf("application/json") !== -1) { // NO SE QUE HACE ESTO PERO FUNCIONA
        const result = await response.json()

        // Reinicia el toast
        loadingToast.dismiss()

        // Toast apropiado seugn el status
        if (response.status === 201) {
          toast({
            title: "Cuenta creada",
            description: "Su cuenta ha sido creada con éxito.",
            variant: "default",
            action: <Link href="/login">Iniciar sesión</Link>

          })
        } else if (response.status === 409) {
          toast({
            title: "Usuario existente",
            description: "El usuario ya está registrado.",
            variant: "default",
            // action para redireccionar a login
            action: <Link href="/login">Iniciar sesión</Link>
          })
        } else {
          toast({
            title: "Error desconocido",
            description: `Ha ocurrido un error inesperado. Status: ${response.status}`,
            variant: "destructive",
          })
        }
      } else {
        throw new Error('Received non-JSON response from server')
      }
    } catch (error) {
      console.error('Error during registration:', error)

      // Reinicia el toast
      loadingToast.dismiss()

      // Muestra el toast de error
      toast({
        title: "Error",
        description: 'Ha ocurrido un error durante el registro',
        variant: "destructive",
      })
    }
  }

  const handleNormalInputs = (
    event: React.FocusEvent<HTMLInputElement>,
    setInputIsValid: React.Dispatch<React.SetStateAction<number>>,
    regex: RegExp
  ) => {
    const valor = event.target.value;
    setInputIsValid(regex.test(valor) ? 1 : valor !== "" ? 2 : 0);
  };
  const handleClaveBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const password = event.target.value;

    const errors: string[] = [];
    if (password.length < 8){
      errors.push("La contraseña debe tener al menos 8 caracteres");
    }
    if (!/\d/g.test(password)){
      errors.push("La contraseña debe tener al menos un número");
    }
      if (!/[a-z]/.test(password)){
      errors.push("La contraseña debe tener al menos una letra minúscula");
    }
    if (!/[A-Z]/.test(password)){
      errors.push("La contraseña debe tener al menos una letra mayúscula");
    }
    if (!/[^a-zA-Z0-9]/g.test(password)){
      errors.push("La contraseña debe tener al menos un símbolo");
    }
      setClaveInputIsValid(errors.length === 0 ? 1 : 2);
    setMensajesErrorContraseña(errors);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRepetirClaveBlur = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const passwordElement = document.getElementById(
      "Clave"
    ) as HTMLInputElement | null;
    const password = passwordElement ? passwordElement.value : "";
    const repeatedPassword = event.target.value;
    setRepetirClaveInputIsValid(password === repeatedPassword ? 1 : 2);
  };
  const handleNumericInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    regex: RegExp,
    setInputIsValid: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const numericInput = event.target.value;
    const isDecimal = regex === regexNumerosDecimales;

    if (!regex.test(numericInput)) {
      const lastChar = numericInput.slice(-1);
      if (isDecimal && lastChar === '.' && numericInput.indexOf('.') === numericInput.length - 1) {
        setInputIsValid(1);
      } else {
        event.target.value = numericInput.slice(0, -1);
        setInputIsValid(2);
      }
    } else {
      setInputIsValid(numericInput !== "" ? 1 : 2);
    }
  };
  const handleCalleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const direccion = event.target.value;
    const api = `https://nominatim.openstreetmap.org/search?street=${direccion}&format=json`;
    setCalleInputIsValid(1);
    fetch(api)
      .then((response) => response.json())
      .then((data) => {
        setCalleInputIsValid(data.length > 0 ? 2 : 3);
      });
  };
  const handleCostoElectricidadUltimoMesBlur = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const costoElectricidad = event.target.value;
    setCostoElectricidadUltimoMes(costoElectricidad);
  }
  const handleCostoTransporteElectricoBlur = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const costoTransporte = event.target.value;
    setCostoTransporteElectrico(costoTransporte);
  }
  const handleKWhConsumidosUltimoMesBlur = (
    event: React.FocusEvent<HTMLInputElement>
  )=> {
    const kWhConsumidos = event.target.value;
    setkWhConsumidosUltimoMes(kWhConsumidos);
  }

  // Fetches
  const fetchCountries = async () => {
    try {
      const response = await fetch(`api/utils/get-countries`);
      const data = await response.json();
      setPaises(
        data.map((pais: { id: string; name: string }) => ({
          id: pais.id,
          name: pais.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };
  const fetchRegions = async (countryId: string) => {
    try {
      const response = await fetch(
        `api/utils/get-regions?country=${countryId}`
      );
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error(`Error fetching regions: ${response.statusText}`);
      }
      const data = await response.json();
      setRegiones(
        data.map((region: { id: string; name: string }) => ({
          id: region.id,
          name: region.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };
  const fetchComunas = async (regionId: string) => {
    try {
      const response = await fetch(`api/utils/get-comuna?region=${regionId}`);
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error(`Error fetching comunas: ${response.statusText}`);
      }
      const data = await response.json();
      setComunas(
        data.map((comuna: { id: string; name: string }) => ({
          id: comuna.id,
          name: comuna.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching comunas:", error);
    }
  };
  const fetchEmpresas = async () => {
    try {
      const response = await fetch(`api/utils/get-empresas`);
      const data = await response.json();
      setEmpresas(data);
    } catch (error) {
      console.error("Error fetching empresas:", error);
    }
  };

  // Interfaces
  interface Pais {
    id: string;
    name: string;
  }
  interface Region {
    id: string;
    name: string;
  }
  interface Comuna {
    id: string;
    name: string;
  }
  interface Empresa {
    id: string;
    name: string;
  }

  // UseEffects
  useEffect(() => { // Fetch  Paises
    fetchCountries();
  }, []);
  useEffect(() => { // Fetch Regiones
    if (selectedPais) {
      fetchRegions(selectedPais);
    } else {
      setRegiones([]);
      setSelectedRegion("");
    }
  }, [selectedPais]);
  useEffect(() => { // Fetch Comunas
    if (selectedRegion) {
      fetchComunas(selectedRegion);
    } else {
      setComunas([]);
      setSelectedComuna("");
    }
  }, [selectedRegion]);
  useEffect(() => {
    fetchEmpresas(); // Fetch Empresas
  }, []);
  useEffect(() => {  // Calcular costos electricos
    const calcularCostokWhTotal = () => {
      const CostoElectricidad = Number(CostoElectricidadUltimoMes);
      const kWhConsumidos = Number(kWhConsumidosUltimoMes);
      if (CostoElectricidad !== null && kWhConsumidos !== null && kWhConsumidos !== 0) {
        const cost = CostoElectricidad / kWhConsumidos;
        setTotalCostkWh(Math.round(Number(cost.toFixed(2))));
      } else {
        setTotalCostkWh(0);
      }
    }
    const calcularCostroTransporteElectrico = () => {
      const CostoTransporte = Number(CostoTransporteElectrico);
      const kWhConsumidos = Number(kWhConsumidosUltimoMes);
        if (CostoTransporte !== null && kWhConsumidos !== null && kWhConsumidos !== 0){
        const cost = CostoTransporte / kWhConsumidos;
        setTotalCostTransport(Math.round(Number(cost.toFixed(2))));
      } else {
        setTotalCostTransport(0);
      }
    }
    calcularCostokWhTotal();
    calcularCostroTransporteElectrico();
  });
  return (
    <form method="POST" onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
    <Card >
      <Image
        src="/icon-128x128.png"
        alt="Logo"
        width={64}
        height={64}
        className="mx-auto mt-5 hover:scale-110 transform transition-transform duration-500"
      />
      <CardHeader>
        <CardTitle className="text-2xl text-center">Registrarse</CardTitle>
        <CardDescription className="text-center">
          Registrate para poder Iniciar sesión
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Informacion cuenta */}
          <div className="space-y-4">
            <h3 className="text-lg text-center font-semibold mb-4">Cuenta</h3>

            {/* Correo */}
            <TooltipProvider>
              <div className="grid gap-2">
                <Label htmlFor="email">Email*</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    required
                    onBlur={(event) =>
                      handleNormalInputs(
                        event,
                        setCorreoInputIsValid,
                        regexCorreo
                      )
                    }
                    className={
                      CorreoinputIsValid === 2 ? "pr-10 border-red-500" : ""
                    }
                  />
                  {CorreoinputIsValid !== 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {CorreoinputIsValid === 1 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {CorreoinputIsValid === 1 ? (
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

            {/* Primer Nombre */}
            <TooltipProvider>
              <div className="grid gap-2">
                <Label htmlFor="Nombre">Nombre*</Label>
                <div className="relative">
                  <Input
                    id="Nombre"
                    type="text"
                    placeholder="Juanito"
                    onBlur={(event) =>
                      handleNormalInputs(
                        event,
                        setNombreInputIsValid,
                        regexNombres
                      )
                    }
                    required={true}
                    className={
                      NombreInputIsValid === 2 ? "pr-10 border-red-500" : ""
                    }
                  />
                  {NombreInputIsValid !== 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {NombreInputIsValid === 1 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {NombreInputIsValid === 1 ? (
                          <p>Nombre válido</p>
                        ) : (
                          <p>Nombre inválido</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </TooltipProvider>

            {/* Apellido */}
            <TooltipProvider>
              <div className="grid gap-2">
                <Label htmlFor="Apellido">Apellido*</Label>
                <div className="relative">
                  <Input
                    id="Apellido"
                    type="text"
                    placeholder="Perez"
                    onBlur={(event) =>
                      handleNormalInputs(
                        event,
                        setApellidoInputIsValid,
                        regexNombres
                      )
                    }
                    required={true}
                    className={
                      ApellidoInputIsValid === 2 ? "pr-10 border-red-500" : ""
                    }
                  />
                  {ApellidoInputIsValid !== 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {ApellidoInputIsValid === 1 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {ApellidoInputIsValid === 1 ? (
                          <p>Apellido válido</p>
                        ) : (
                          <p>Apellido inválido</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </TooltipProvider>

            {/* Segundo Apellido */}
            <TooltipProvider>
              <div className="grid gap-2">
                <Label htmlFor="SegundoApellido">Segundo apellido*</Label>
                <div className="relative">
                  <Input
                    id="SegundoApellido"
                    type="text"
                    placeholder="Martinez"
                    onBlur={(event) =>
                      handleNormalInputs(
                        event,
                        setSegundoApellidoInputIsValid,
                        regexNombres
                      )
                    }
                    required={true}
                    className={
                      SegundoApellidoInputIsValid === 2
                        ? "pr-10 border-red-500"
                        : ""
                    }
                  />
                  {SegundoApellidoInputIsValid !== 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {SegundoApellidoInputIsValid === 1 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {NombreInputIsValid === 1 ? (
                          <p>Segundo apellido válido</p>
                        ) : (
                          <p>Segundo apellido inválido</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </TooltipProvider>

            {/* Contraseña */}
            <TooltipProvider>
              <div className="grid gap-2">
                <div className="relative">
                  <Label htmlFor="Clave">Contraseña*</Label>
                  <div className="flex items-center">
                    <Input
                      id="Clave"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="******** (letras y números)"
                      required={true}
                      onBlur={handleClaveBlur}
                      className={
                        ClaveInputIsValid === 2 ? "pr-10 border-red-500" : ""
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0"
                      onClick={toggleNewPasswordVisibility}
                    >
                      {showNewPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </Button>
                    {ClaveInputIsValid !== 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute right-10">
                            {ClaveInputIsValid === 1 ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {ClaveInputIsValid === 1 ? (
                            <p>Contraseña válida</p>
                          ) : (
                            <ul className="list-disc pl-4">
                              {MensajesErrorContraseña.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  {
                      // Mostrar solo en vistas moviles atributo p de color rojo
                      ClaveInputIsValid === 2 ? (
                        <>
                          <p className="text-red-500 text-sm sm:hidden block">Contraseña inválida.</p>
                          {MensajesErrorContraseña.map((error, index) => (
                            <p key={index} className="text-red-500 text-sm block">{error}</p>
                          ))}
                        </>
                      ) : null
                    }
                </div>
              </div>
            </TooltipProvider>

            {/* Repetir contraseña */}
            <TooltipProvider>
              <div className="grid gap-2">
                <Label htmlFor="repeatpassword">Repetir contraseña*</Label>
                <div className="relative flex items-center">
                  <Input
                    id="repeatpassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="******** (letras y números)"
                    required
                    onBlur={handleRepetirClaveBlur}
                    className={
                      RepetirClaveInputIsValid === 2
                        ? "pr-10 border-red-500"
                        : ""
                    }
                  />
                  <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </Button>
                  {RepetirClaveInputIsValid !== 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute right-10 top-1/2 -translate-y-1/2">
                          {RepetirClaveInputIsValid === 1 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {RepetirClaveInputIsValid === 1 ? (
                          <p>Las contraseñas coinciden</p>
                        ) : (
                          <p>Las contraseñas no coinciden</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                {
                  RepetirClaveInputIsValid === 2 ? (
                    <p className="text-red-500 text-sm">Las contraseñas no coinciden.</p>
                  ) : null
                }
              </div>
            </TooltipProvider>

          </div>

          {/* Informacion contacto */}
          <div className="space-y-4">
            <h3 className="text-lg text-center font-semibold mb-4">
              Contacto
            </h3>

            {/* Telefono */}
            <TooltipProvider>
              <div className="grid gap-2">
                <Label htmlFor="numAddress">Teléfono*</Label>
                <div className="relative">
                  <Input
                    id="numAddress"
                    type="text"
                    placeholder="9 1313 1313"
                    required
                    onChange={(event) =>
                      handleNumericInputChange(
                        event,
                        regexNumerosEnteros,
                        setTelefonoInputIsValid
                      )
                    }
                    className={
                      TelefonoInputIsValid === 2 ? "pr-10 border-red-500" : ""
                    }
                  />
                  {TelefonoInputIsValid !== 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {TelefonoInputIsValid === 1 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {TelefonoInputIsValid === 1 ? (
                          <p>Teléfono válido</p>
                        ) : (
                          <p>Teléfono inválido</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </TooltipProvider>

            {/* Pais */}
            <div className="grid gap-2">
              <Label>País*</Label>
              <Select value={selectedPais} onValueChange={setSelectedPais}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu país" />
                </SelectTrigger>
                <SelectContent>
                  {paises.map((pais) => (
                    <SelectItem key={pais.id} value={pais.id}>
                      {pais.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region */}
            <div className="grid gap-2">
              <Label>Región*</Label>
              <Select
                value={selectedRegion}
                onValueChange={setSelectedRegion}
                disabled={regiones.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu región" />
                </SelectTrigger>
                <SelectContent>
                  {regiones.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name.length > 35
                        ? (
                            region.name.charAt(0).toUpperCase() +
                            region.name.slice(1).toLowerCase()
                          ).slice(0, 35) + "..."
                        : region.name.charAt(0).toUpperCase() +
                          region.name.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Comuna */}
            <div className="grid gap-2">
              <Label>Comuna*</Label>
              <Select
                value={selectedComuna}
                onValueChange={setSelectedComuna}
                disabled={comunas.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu comuna" />
                </SelectTrigger>
                <SelectContent>
                  {comunas.map((comuna) => (
                    <SelectItem key={comuna.id} value={comuna.id}>
                      {comuna.name.charAt(0).toUpperCase() +
                        comuna.name.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Calle */}
            <TooltipProvider>
              <div className="grid gap-2">
                <Label htmlFor="Calle">Calle*</Label>
                <div className="relative">
                  <Input
                    id="Calle"
                    type="text"
                    placeholder="Avenida Esquina Blanca"
                    required
                    onBlur={handleCalleBlur}
                    disabled={
                      selectedComuna === "" ||
                      selectedRegion === "" ||
                      selectedPais === ""
                    }
                    className={
                      CalleInputIsValid === 3 ? "pr-10 border-red-500" : ""
                    }
                  />
                  {CalleInputIsValid !== 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {CalleInputIsValid === 1 ? (
                            <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
                          ) : CalleInputIsValid === 2 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {CalleInputIsValid === 1 && (
                          <p>Validando dirección...</p>
                        )}
                        {CalleInputIsValid === 2 && <p>Dirección válida</p>}
                        {CalleInputIsValid === 3 && <p>Dirección inválida</p>}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </TooltipProvider>

            {/* Numero de casa */}
            <TooltipProvider>
              <div className="grid gap-2">
                <Label htmlFor="Numero">Número*</Label>
                <div className="relative">
                  <Input
                    id="Numero"
                    type="text"
                    placeholder="501"
                    required
                    disabled={CalleInputIsValid !== 2}
                    onChange={(event) =>
                      handleNumericInputChange(
                        event,
                        regexNumerosEnteros,
                        setNumeroInputIsValid
                      )
                    }
                  />
                  {NumeroInputIsValid !== 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {NumeroInputIsValid === 1 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {NumeroInputIsValid === 1 ? (
                          <p>Número válido</p>
                        ) : (
                          <p>Número inválido</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </TooltipProvider>

          </div>

          {/* Informacion electrica */}
          <div className="space-y-4">
            <h3 className="text-lg text-center font-semibold mb-4">
              Información electrica
            </h3>

            {/* Empresa */}
            <div className="grid gap-2">
              <Label>Empresa*</Label>
              <Select value={selectedEmpresa} onValueChange={setSelectedEmpresa}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Costos administracion*/}
            <TooltipProvider>
              <div className="grid gap-2">
                <Label htmlFor="CostoAdministración">
                  Costo administración*
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <CircleDollarSign className="h-5 w-5" />
                  </span>
                  <Input
                    id="CostoAdministración"
                    type="text"
                    placeholder="1000"
                    onChange={(event) =>
                      handleNumericInputChange(
                        event,
                        regexNumerosEnteros,
                        setCostoAdministracionInputIsValid
                      )
                    }
                    className={
                      CostoAdministracionInputIsValid === 2
                        ? "pr-10 border-red-500 pl-10"
                        : "pl-10"
                    }
                  />
                  {CostoAdministracionInputIsValid !== 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {CostoAdministracionInputIsValid === 1 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {CostoAdministracionInputIsValid === 1 ? (
                          <p>Costo administración válido</p>
                        ) : (
                          <p>Costo administración inválido</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </TooltipProvider>

            {/* kWh Consumidos ultimo mes !IMPORTANTE CALCULO */}
            <TooltipProvider>
              <div className="grid gap-2">
                <Label htmlFor="kWhConsumidosUltimoMes">
                KWh Consumidos ultimo mes
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <Zap className="h-5 w-5" />
                  </span>
                  <Input
                    id="kWhConsumidosUltimoMes"
                    type="text"
                    placeholder="999 kWh"
                    onChange={(event) =>
                      handleNumericInputChange(
                        event,
                        regexNumerosDecimales,
                        setkWhConsumidosUltimoMesInputIsValid
                      )
                    }
                    onBlur = {handleKWhConsumidosUltimoMesBlur}
                    className={
                      kWhConsumidosUltimoMesInputIsValid === 2
                        ? "pr-10 border-red-500 pl-10"
                        : "pl-10"
                    }
                  />
                  {kWhConsumidosUltimoMesInputIsValid !== 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {kWhConsumidosUltimoMesInputIsValid === 1 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {kWhConsumidosUltimoMesInputIsValid === 1 ? (
                          <p>kWh Consumidos ultimo mes válido</p>
                        ) : (
                          <p>kWh Consumidos ultimo mes inválido</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </TooltipProvider>

            {/* Costo kWh ultimo mes !IMPORTANTE CALCULO */}
            <TooltipProvider>
              <div className="grid gap-2">
                <Label htmlFor="CostokWhUltimoMes">
                Costo kWh ultimo mes
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <CircleDollarSign className="h-5 w-5" />
                  </span>
                  <Input
                    id="CostokWhUltimoMes"
                    type="text"
                    placeholder="1000"
                    onChange={(event) =>
                      handleNumericInputChange(
                        event,
                        regexNumerosEnteros,
                        setCostoElectricidadUltimoMesInputIsValid
                      )
                    }
                    onBlur={handleCostoElectricidadUltimoMesBlur}

                    className={
                      CostoElectricidadUltimoMesInputIsValid === 2
                        ? "pr-10 border-red-500 pl-10"
                        : "pl-10"
                    }
                  />
                  {CostoElectricidadUltimoMesInputIsValid !== 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {CostoElectricidadUltimoMesInputIsValid === 1 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {CostoElectricidadUltimoMesInputIsValid === 1 ? (
                          <p>Costo kWh ultimo mes válido</p>
                        ) : (
                          <p>Costo kWh ultimo mes inválido</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </TooltipProvider>

            {/* Costo transporte electrico ultimo mes !IMPORTANTE CALCULO */}
            <TooltipProvider>
              <div className="grid gap-2">
                <Label htmlFor="CostoTransporteElectrico">
                  Costo transporte electrico
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <CircleDollarSign className="h-5 w-5" />
                  </span>
                  <Input
                    id="CostoTransporteElectrico"
                    type="text"
                    placeholder="1000"
                    onChange={(event) =>
                      handleNumericInputChange(
                        event,
                        regexNumerosEnteros,
                        setCostoTransporteElectricoInputIsValid
                      )
                    }
                    className={
                      CostoTransporteElectricoInputIsValid === 2
                        ? "pr-10 border-red-500 pl-10"
                        : "pl-10"
                    }
                    onBlur={handleCostoTransporteElectricoBlur}
                  />
                  {CostoTransporteElectricoInputIsValid !== 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {CostoTransporteElectricoInputIsValid === 1 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {CostoTransporteElectricoInputIsValid === 1 ? (
                          <p>Costo transporte electrico válido</p>
                        ) : (
                          <p>Costo transporte electrico inválido</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </TooltipProvider>

            {/* Costo de electricidad por kWh. Resultado de Costo electricidad último mes/KWh Consumidos ultimo mes */}
            <div className="grid gap-2">
              <Label>Costo de electricidad por kWh</Label>
              <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <CircleDollarSign className="h-5 w-5" />
                </span>
              <Input
                type="text"
                id="CostoElectricidadkWh"
                value={totalCostkWh ? `${Math.round(totalCostkWh)}` : "Esperando valores..."}
                disabled
                className="pl-10 pr-10"
              />
              </div>
            </div>

            {/* Costo transporte electrico por kWh. Resultado de Costo transporte electrico/KWh Consumidos ultimo mes */}
            <div className="grid gap-2">
              <Label>Costo transporte electrico por kWh</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <CircleDollarSign className="h-5 w-5" />
                </span>
              <Input
                type="text"
                id="CostoTransporteElectricoKWh"
                value={totalCostTransport ? `${Math.round(totalCostTransport)}` : "Esperando valores..."}
                disabled
                className="pl-10 pr-10"
                />
              </div>
            </div>

          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center mt-6 gap-2">
        <Button className="w-full max-w-xs" type="submit">Registrarse</Button>
        <HelpForm />
      </CardFooter>
    </Card>
      <Toaster/>
    </form>
  );
}