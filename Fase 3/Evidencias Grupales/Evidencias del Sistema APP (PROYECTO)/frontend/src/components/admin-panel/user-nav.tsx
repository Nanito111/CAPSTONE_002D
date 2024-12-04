"use client";

import Link from "next/link";
import { LayoutGrid, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export function UserNav() {
  const [logoutStatus, setLogoutStatus] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("John Titor");
  const [email, setEmail] = useState("johntitor@energymeter.com");
  const [iconWords, setIconWords] = useState("O");

  const handleLogout = () => {
    console.log("handleLogout called");
    setLogoutStatus(false);
    const apiKillSession = `/api/account/killsession`;
    fetch(apiKillSession, {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          setLogoutStatus(true);
          setTimeout(() => {
            window.location.href = "/login";
          }, 500);
        } else {
          console.error("API response not OK");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    const handleName = async () => {
      const apiGetUserData = `/api/utils/get-user-data`;
      const response = await fetch(apiGetUserData, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        const nombreFromApi = capitalize(data.user.first_name) + " " + capitalize(data.user.last_name);
        const iconWords = data.user.first_name.charAt(0).toUpperCase() + data.user.last_name.charAt(0).toUpperCase();
        setIconWords(iconWords);
        setNombreUsuario(nombreFromApi);
        setEmail((data.user.email).toLowerCase());
      } else {
        console.error("API response not OK");
      }
    }
    handleName();
  },  [])

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="#" alt="Avatar" />
                  <AvatarFallback className="bg-transparent">{iconWords}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{nombreUsuario}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/dashboard" className="flex items-center">
              <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/cuenta" className="flex items-center">
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              Cuenta
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href={"/"} >
        <DropdownMenuItem className="hover:cursor-pointer" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" onClick={handleLogout}/>
          { logoutStatus ? "Cerrando sesion.." : "Cerrar sesión"  }
        </DropdownMenuItem>
          </Link>
      </DropdownMenuContent>
    </DropdownMenu>
    );
}