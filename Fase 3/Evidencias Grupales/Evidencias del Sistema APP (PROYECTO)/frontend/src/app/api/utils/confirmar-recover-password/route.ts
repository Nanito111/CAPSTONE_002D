import { NextResponse } from 'next/server';


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    console.log('token'+token)

    if (!token) {
        return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Token received', token });
}