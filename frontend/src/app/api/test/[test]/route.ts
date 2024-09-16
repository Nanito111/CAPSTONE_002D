import { NextResponse } from "next/server";

export function GET(request: Request, { params }: { params: { test: string } }) {
  return NextResponse.json({ message: `Hello ${params.test}` });
}

export function POST(request: Request, { params }: { params: { test: string } }) {
  return NextResponse.json({ message: `Hello ${params.test}` });
}