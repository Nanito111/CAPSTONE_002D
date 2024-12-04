import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";


export default function FooterButtons( { textoBotonPrincipal }: { textoBotonPrincipal: string }) {
  return (
    <CardFooter className="flex flex-col w-full">
    <Button className="w-full mb-2" type="submit">{textoBotonPrincipal}</Button>
  </CardFooter>
  );
}