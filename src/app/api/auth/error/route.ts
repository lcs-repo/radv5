import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error') || 'Unknown error';

  console.error('Authentication error:', error);

  return NextResponse.json({ error }, { status: 400 });
}

export async function POST(request: Request) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}