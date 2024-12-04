import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AgregarDispositivo from "@/components/agregar-dispositivo";

// !Esta estructura puede sufrir cambios en el futuro.
interface IDispositivo {
  idDispositivo: string | number;
  nombreDispositivo: string;
  statusDispositivo: string;
  descriptionDispositivo: string;
  ultimaConexion: string;
  fechaCreacion: string;
  ultimaMedicion: string;
  color: string;
  svg: React.ElementType; // Asumiendo que svg es un componente React
}

interface CardDispositivoProps {
  Dispositivos: IDispositivo[] | [];
}

export default function CardDispositivo({ Dispositivos }: CardDispositivoProps) {
  // Si longitud de dispositivos == 0, mostrar un mensaje de que no hay dispositivos.
  if (Dispositivos.length === 0) {
    return <>
      <Card className="w-96">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">No hay dispositivos</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <CardDescription className="text-bold">No hay dispositivos disponibles.</CardDescription>
          <CardDescription className="text-sm">Si deseas agregar un nuevo dispositivo haz click en el boton inferior.</CardDescription>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <AgregarDispositivo />
        </CardFooter>
      </Card>
    </>
  }

  // Si la longitud de dispositivos es menor a 6 (maxima por usuario estandar), mostrar los dispositivos y campo para agregar un nuevo dispositivo.
  if (Dispositivos.length < 6) {
    return (
      <>
        {Dispositivos.map((dispositivo) => (
          <Card
            key={dispositivo.idDispositivo}
          >
            <CardHeader className="flex items-center justify-between">
            <Link
              href={`/dispositivos/${dispositivo.idDispositivo}`}
            >
              <CardTitle className="text-xl font-bold">
                {dispositivo.nombreDispositivo}
              </CardTitle>
            </Link>
              <CardDescription className="text-sm">
                ID del dispositivo: {dispositivo.idDispositivo}
              </CardDescription>
              <CardDescription className="text-sm">
                {dispositivo.statusDispositivo}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <dispositivo.svg className="w-10 h-10 mx-auto mb-3" style={{ color: `var(${dispositivo.color})` }} />
              <CardDescription className="text-sm">
                {dispositivo.descriptionDispositivo}
              </CardDescription>
              <CardDescription className="text-sm">
                Ultima conexion: {dispositivo.ultimaConexion}
              </CardDescription>
              <CardDescription className="text-sm">
                Fecha de creacion: {dispositivo.fechaCreacion}
              </CardDescription>
              <CardDescription className="text-sm">
                Ultima medicion: {dispositivo.ultimaMedicion}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex items-center justify-between"></CardFooter>
          </Card>
        ))}
        <Card className="">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Agregar nuevo dispositivo</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <CardDescription className="text-bold">Agrega un nuevo dispositivo.</CardDescription>
            <CardDescription className="text-sm">Si deseas agregar un nuevo dispositivo haz click en el boton inferior.</CardDescription>
          </CardContent>
          <CardFooter className="flex items-center justify-center mt-16">
            <AgregarDispositivo />
          </CardFooter>
        </Card>
      </>
    )
  }

  // !TODO: Fixear colores de sombra al momento de hace hover, solamente se activan en el primer y segundo dispositivo. (no se porque no funciona)
  return (
    <>
      {Dispositivos.map((dispositivo) => (
        <Card
          key={dispositivo.idDispositivo}
          className={`transition hover:shadow-[${dispositivo.color}] hover:shadow-lg`}
        >
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              {dispositivo.nombreDispositivo}
            </CardTitle>
            <CardDescription className="text-sm">
              ID del dispositivo: {dispositivo.idDispositivo}
            </CardDescription>
            <CardDescription className="text-sm">
              {dispositivo.statusDispositivo}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <dispositivo.svg className="w-10 h-10 mx-auto mb-3" style={{ color: `var(${dispositivo.color})`}}/>
            <CardDescription className="text-sm">
              {dispositivo.descriptionDispositivo}
            </CardDescription>
            <CardDescription className="text-sm">
              Ultima conexion: {dispositivo.ultimaConexion}
            </CardDescription>
            <CardDescription className="text-sm">
              Fecha de creacion: {dispositivo.fechaCreacion}
            </CardDescription>
            <CardDescription className="text-sm">
              Ultima medicion: {dispositivo.ultimaMedicion}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex items-center justify-between"></CardFooter>
        </Card>
      ))}
    </>
  );
}