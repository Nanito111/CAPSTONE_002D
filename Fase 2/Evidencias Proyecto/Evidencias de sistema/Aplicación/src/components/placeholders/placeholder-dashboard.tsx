import GraficoAreaGradiente  from "@/components/charts/GraficoAreaGradiente";
import GraficoPie from "@/components/charts/GraficoPie";
import BarrasApiladas from "@/components/charts/GraficoBarrasApiladas";
import ConsumoActual from "@/components/charts/CardConsumoActual";
import MedidorGauge from "@/components/charts/MedidorGauge";
import GraficoConsumoDiario from "@/components/charts/GraficoConsumoDia";
import { Command } from "@/components/ui/command";
import { Card, CardContent } from "@/components/ui/card";

export default function PlaceholderContent() {
  return (
    <Card className="rounded-lg border-none mt-6 w-full">
      <CardContent className="p-6">
        <div className="min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
            <h1 className="m-3 font-bold">Resumen Consumo general</h1>
            <div className="m-5 grid grid-cols-1 gap-5 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
              <ConsumoActual/>
              <BarrasApiladas />
              <GraficoAreaGradiente />
              <GraficoPie/>
            </div>

          <div>
            <h1 className="m-3 font-bold">Dispositivo 1</h1>
            <div className="m-5 grid grid-cols-1 gap-5 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
              <MedidorGauge />
              <GraficoAreaGradiente />
              <GraficoConsumoDiario className="2xl:col-span-1 md:col-span-2 sm:col-span-1"/>
            </div>
          </div>

          <div>
            <h1 className="m-3 font-bold">Dispositivo 2</h1>
            <div className="m-5 grid grid-cols-1 gap-5 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
              <MedidorGauge />
              <GraficoAreaGradiente />
              <GraficoConsumoDiario className="2xl:col-span-1 md:col-span-2 sm:col-span-1"/>
            </div>
          </div>

          <div>
            <h1 className="m-3 font-bold">Dispositivo 3</h1>
            <div className="m-5 grid grid-cols-1 gap-5 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
              <MedidorGauge />
              <GraficoAreaGradiente />
              <GraficoConsumoDiario className="2xl:col-span-1 md:col-span-2 sm:col-span-1"/>
            </div>
          </div>

          <div>
            <h1 className="m-3 font-bold">Dispositivo 4</h1>
            <div className="m-5 grid grid-cols-1 gap-5 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
              <MedidorGauge />
              <GraficoAreaGradiente />
              <GraficoConsumoDiario className="2xl:col-span-1 md:col-span-2 sm:col-span-1"/>
            </div>
          </div>

          <div>
            <h1 className="m-3 font-bold">Dispositivo 5</h1>
            <div className="m-5 grid grid-cols-1 gap-5 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
              <MedidorGauge />
              <GraficoAreaGradiente />
              <GraficoConsumoDiario className="2xl:col-span-1 md:col-span-2 sm:col-span-1"/>
            </div>
          </div>

        </div>
      </CardContent>
    <Command/>
    </Card>

  );
}
