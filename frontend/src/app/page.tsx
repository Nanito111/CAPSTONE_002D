import Image from "next/image"

import { ModeToggle } from "@/components/mode-toggle"
import TestButton from "@/components/dev/TestButton"
import  {MoreInfoDialog} from '@/components/more-info-dialog'
import { Github } from "lucide-react"

const TestPages = [
  {
    href: "/login/",
    text: "Login",
  },
  {
    href: "/register/",
    text: "Register",
  },
]

export default function Home() {

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="relative w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64">
            <Image
              src="/icon-512x512.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="space-y-4 max-w-[600px]">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
              {process.env.CURRENT_ENV ? `Ambiente: ${process.env.CURRENT_ENV}` : 'EnergyMeter'}
            </h1>
            <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
            Proyecto Capstone 2024 Seccion 002D <br/> Grupo 3 <br/> Evaluador Helton Smith Bustos Saez
            </h2>
            <p className="text-xl text-muted-foreground">
              {process.env.API_URL ? `API URL: ${process.env.API_URL}` : "No hay api conectada"}
            </p>
          </div>

          <div className="flex gap-4 flex-wrap justify-center">
            {TestPages.map((page) => (
              <TestButton key={page.href} href={page.href} text={page.text} />
            ))}
          </div>
          <MoreInfoDialog />
          <ModeToggle />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6 flex-wrap items-center justify-center">
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://github.com/Nanito111/CAPSTONE_002D"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={24} />
              Repositorio
            </a>
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://github.com/Nanito111/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={24} />
              Francisco Galdames
            </a>
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://github.com/notGabo/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={24} />
              Gabriel Soto
            </a>
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://github.com/ckoquexd"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={24} />
              Jorge Parra
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}