"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function AddressInput() {
  const [inputIsValid, setInputIsValid] = useState(0);

  const handleAddressBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const direccion = event.target.value;
    const api = `https://nominatim.openstreetmap.org/search?street=${direccion}&format=json`;
    setInputIsValid(1);
    fetch(api)
      .then((response) => response.json())
      .then((data) => {
        setInputIsValid(data.length > 0 ? 2 : 3);
      });
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="street">Calle</Label>
      <Input
        id="street"
        type="text"
        placeholder="Avenida Esquina Blanca"
        required
        onBlur={handleAddressBlur}
      />
      {inputIsValid === 1 && <p className="text-sm text-gray-500">Validando dirección...</p>}
      {inputIsValid === 2 && <p className="text-sm text-green-500">Dirección válida</p>}
      {inputIsValid === 3 && <p className="text-sm text-red-500">Dirección inválida</p>}

    </div>
  );
}