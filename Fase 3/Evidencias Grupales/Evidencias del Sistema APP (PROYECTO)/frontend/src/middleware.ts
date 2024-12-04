import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/cuenta",
  "/dispositivos",
  "/notificaciones",
];

const dynamicProtectedRoutes = [
  /^\/dispositivos\/\d+$/, 
];

export default function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get('authenticated');
  const isProtectedRoute = protectedRoutes.includes(req?.nextUrl?.pathname) ||
    dynamicProtectedRoutes.some((route) => route.test(req?.nextUrl?.pathname));

  if (!isAuthenticated && isProtectedRoute) {
    const absoluteUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  }
  return NextResponse.next();
}