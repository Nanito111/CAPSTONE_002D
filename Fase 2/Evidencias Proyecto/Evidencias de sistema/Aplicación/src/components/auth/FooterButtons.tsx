import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import GoogleIcon from "@/components/ui/svg/google-icon";
import { Separator } from "@/components/ui/separator";


export default function FooterButtons( { textoBotonPrincipal }: { textoBotonPrincipal: string }) {
  return (
    <CardFooter className="flex flex-col w-full">
    <Button className="w-full mb-2">{textoBotonPrincipal}</Button>
    <Separator className="w-full mb-2" />
    <Button className="flex w-full">
      <GoogleIcon />
      <p className="ml-2">Iniciar sesión con Google</p>
    </Button>
  </CardFooter>
  );
}