import Link from "next/link";

export function Footer() {
  return (
    <div className="z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 md:mx-8 flex h-14 items-center">
        <p className="text-xs md:text-sm leading-loose text-muted-foreground text-left">
          Pagina en desarrollo.
          El codigo de fuente esta disponible en {" "}
          <Link
            href="https://github.com/Nanito111/CAPSTONE_002D/tree/website"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Github
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
