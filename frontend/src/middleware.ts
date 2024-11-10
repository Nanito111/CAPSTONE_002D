import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/cuenta",
  "/dispositivos",
  "/dispositivos/*",
  "/notificaciones",
];

export default function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get('authenticated');
  console.log(`Usuario autenticado[middleware]: ${isAuthenticated}`);

  if (!isAuthenticated && protectedRoutes.includes(req?.nextUrl?.pathname)) {
    const absoluteUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  }
  return NextResponse.next();
}