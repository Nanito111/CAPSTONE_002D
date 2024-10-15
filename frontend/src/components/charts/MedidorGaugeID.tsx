"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Tabla radial con secciones apiladas";

export default function MedidorGaugeID({
  consumo,
  nombreDispositivo,
  limite,
  color,
  fecha,
}: {
  consumo: number;
  nombreDispositivo: string;
  limite: number;
  color: string;
  fecha: string;
}) {

  const total = consumo + limite;
  const chartData = [
    {
      day: fecha,
      limiteDadoGrafico:  (limite / (limite + consumo)) * total,
      medicionGrafico: (consumo / (limite + consumo)) * total,
    },
  ];

  const chartConfig = {
    medicion: {
      label: "Uso actual",
      color: `hsl(var(${color}))`,
    },
    limite: {
      label: "Restante",
      color: `hsl(var(${color}))`,
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Consumo actual de {nombreDispositivo}</CardTitle>
        <CardDescription>
          Mostrando el consumo actual en tiempo real
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {consumo.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          KWh
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="limiteDadoGrafico"
              fill="hsl(0, 0%, 50%)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="medicionGrafico"
              stackId="b"
              cornerRadius={5}
              fill={`var(${color})`}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {
            limite > 0 ? (
              <>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                <span>Limite de consumo: {limite} Wh</span>
              </>
            ) : (
              <span>Limite de consumo no esta definido</span>
            )
          }
        </div>
        <div className="leading-none text-muted-foreground">
          Se notificara cuando el uso exceda el limite.
        </div>
      </CardFooter>
    </Card>
  );
}
