import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country');
    const API_URL = process.env.API_URL + '/utils/get-regions?country=' + country;
    const response = await fetch(API_URL)
    const data = await response.json()
    return NextResponse.json(data)
  }