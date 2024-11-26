"use client"

import GraficoAreaGradiente  from "@/components/charts/GraficoAreaGradiente";
import GraficoPie from "@/components/charts/GraficoPie";
import BarrasApiladas from "@/components/charts/GraficoBarrasApiladas";
import ConsumoActual from "@/components/charts/CardConsumoActual";
import MedidorGauge from "@/components/charts/MedidorGauge";
import GraficoConsumoDiario from "@/components/charts/GraficoConsumoDia";
import { Command } from "@/components/ui/command";
import { Card, CardContent } from "@/components/ui/card";

export default function PlaceholderContent() {
  const consumoActual = Number((Math.random() * 100).toFixed(0))
  const fechaActual = new Date()
  const horaActual = fechaActual.getHours()
  const minutoActual = fechaActual.getMinutes()

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const GenUltimosSeisMeses = () => {
    const listaMeses: string[] = []
    for (let i = 0; i < 6; i++) {
      listaMeses.push(meses[(fechaActual.getMonth() - i + 12) % 12])
    }
    return listaMeses
  }

  const chartDataMonthly = () => {
    const ultimos6Meses = GenUltimosSeisMeses();
    const data = ultimos6Meses.map((mes) => {
      const consumos: number[] = [];
      for (let i = 0; i < 6; i++) {
        consumos.push(Number((Math.random() * 100 + 200).toFixed(0)));
      }
      const consumoTotal = consumos.reduce((acc, curr) => acc + curr, 0);
      return {
        month: mes,
        dispositivo1: consumos[0],
        dispositivo2: consumos[1],
        dispositivo3: consumos[2],
        dispositivo4: consumos[3],
        dispositivo5: consumos[4],
        dispositivo6: consumos[5],
        consumoTotal: consumoTotal,
      };
    });
    return data;
  }

  const chartDataPie = () => {
    const consumoThisMonth = chartDataMonthly()[0].consumoTotal;
    const dispositivos = ["Dispositivo 1", "Dispositivo 2", "Dispositivo 3", "Dispositivo 4", "Dispositivo 5"];
    const consumos: number[] = [];
    let consumoTotal = 0;

    dispositivos.forEach((_, index) => {
      let consumo;
      if (index === dispositivos.length - 1) {
        consumo = consumoThisMonth - consumoTotal;
      } else {
        consumo = Number((Math.random() * (consumoThisMonth - consumoTotal) / (dispositivos.length - index)).toFixed(0));
        consumoTotal += consumo;
      }
      consumos.push(consumo);
    });

    const data = consumos.map((consumo, index) => {
      return {
        dispositivo: dispositivos[index],
        consumo: consumo,
        fill: `var(--color-dispositivo-${index + 1})`
      };
    });

    return data;
  };

  const chartDataThisMonth = () => {
    const dias = fechaActual.getDate()
    const consumos: number[] = []
    const consumoMesActual = chartDataMonthly()[0].consumoTotal
    let consumoTotal = 0
    for (let i = 0; i < dias; i++) {
      if (i === dias - 1) {
        consumos.push(consumoMesActual - consumoTotal)
      } else {
        const consumo = Number((Math.random() * 100).toFixed(0))
        consumos.push(consumo)
        consumoTotal += consumo
      }
    }
    const data = consumos.map((consumo, index) => {
      return {
        day: index + 1,
        consumo: consumo
      }
    })
    return data
  }

  const chartDataThisDay = () => {
    const horas: string[] = [];
    for (let i = 22; i >= 0; i -= 2) {
      const hora = (horaActual - i + 24) % 24;
      horas.push(`${hora}:${minutoActual < 10 ? '0' + minutoActual : minutoActual}`);
    }
    const data = horas.map((hora) => {
      return {
        hora: hora,
        dispositivo: Number((Math.random() * 100 ).toFixed(0)),
      }
    });
    return data;
  }

  const dataMedidorGauge = () => {
    const dia = fechaActual.toLocaleString('en-us', {  weekday: 'long' })
    return [
      { day: dia, medicion: Number((Math.random()*100).toFixed(0)), limite: 120 }
    ]
  }
  console.log(chartDataThisDay())

  return (
    <Card className="rounded-lg border-none mt-6 w-full">
      <CardContent className="p-6">
        <div className="min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
            <h1 className="m-3 font-bold">Resumen Consumo general</h1>
            <div className="m-5 grid grid-cols-1 gap-5 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
              <ConsumoActual consumo={consumoActual}/>
              <GraficoPie data={chartDataPie()} mes={meses[fechaActual.getMonth()]} annio={fechaActual.getFullYear()}/>
              <BarrasApiladas data={chartDataMonthly()} className="2xl:col-span-1 md:col-span-2 sm:col-span-1"/>
            </div>

          <div>
            <h1 className="m-3 font-bold">Dispositivo 1</h1>
            <div className="m-5 grid grid-cols-1 gap-5 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
              <MedidorGauge chartData={dataMedidorGauge()}/>
              <GraficoAreaGradiente data={chartDataMonthly()}/>
              <GraficoConsumoDiario className="2xl:col-span-1 md:col-span-2 sm:col-span-1" chartData={chartDataThisDay()}/>
            </div>
          </div>

          <div>
            <h1 className="m-3 font-bold">Dispositivo 2</h1>
            <div className="m-5 grid grid-cols-1 gap-5 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
              <MedidorGauge chartData={dataMedidorGauge()}/>
              <GraficoAreaGradiente data={chartDataMonthly()}/>
              <GraficoConsumoDiario className="2xl:col-span-1 md:col-span-2 sm:col-span-1" chartData={chartDataThisDay()}/>
            </div>
          </div>

        </div>
      </CardContent>
    <Command/>
    </Card>

  );
}
