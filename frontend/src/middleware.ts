import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/cuenta",
  "/dispositivos",
  "/notificaciones",
];

const dynamicProtectedRoutes = [
  /^\/dispositivos\/\d+$/, // Ruta dinámica para "/dispositivos/[id]"
];

export default function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get('authenticated');
  console.log(`Usuario autenticado[middleware]: ${isAuthenticated}`);

  const isProtectedRoute = protectedRoutes.includes(req?.nextUrl?.pathname) ||
    dynamicProtectedRoutes.some((route) => route.test(req?.nextUrl?.pathname));

  if (!isAuthenticated && isProtectedRoute) {
    const absoluteUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  }
  return NextResponse.next();
}