"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle } from "lucide-react";

export function PhoneInput() {
    const [inputIsValid, setInputIsValid] = useState(0);

    const handleNumericInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const numAddress = event.target.value;
        const regexNumAddress = /^[0-9\s]+$/;
        if (!regexNumAddress.test(numAddress)) {
            event.target.value = numAddress.slice(0, -1);
        }
        setInputIsValid(regexNumAddress.test(numAddress) && numAddress.length >= 7 ? 1 : 2);
    }

    return (
        <TooltipProvider>
            <div className="grid gap-2">
                <Label htmlFor="numAddress">Teléfono</Label>
                <div className="relative">
                    <Input
                        id="numAddress"
                        type="text"
                        placeholder="9 1313 1313"
                        required
                        onChange={handleNumericInputChange}
                        className={inputIsValid === 2 ? "pr-10 border-red-500" : ""}
                    />
                    {inputIsValid !== 0 && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {inputIsValid === 1 ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                {inputIsValid === 1 ? (
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
    );
}