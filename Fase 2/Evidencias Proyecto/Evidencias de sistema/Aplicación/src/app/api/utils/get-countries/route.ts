import { NextResponse } from 'next/server';

export async function GET() {
    const API_URL = process.env.API_URL + '/utils/get-countries'
    const response = await fetch(API_URL)
    const data = await response.json()
    return NextResponse.json(data)
  }