import FormularioNotificaciones from "../config-notificaciones";
import { Command } from "@/components/ui/command";
import { Card, CardContent } from "@/components/ui/card";



export default function PlaceholderContent() {
  return (
    <Card className="rounded-lg border-none mt-6 w-full">
      <CardContent className="p-6">
        <div className="min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
            <h1 className="m-3 font-bold">¿Que notificaciones deseas recibir?</h1>
            <FormularioNotificaciones/>
        </div>
      </CardContent>
    <Command/>
    </Card>

  );
}



