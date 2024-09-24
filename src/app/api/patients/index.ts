import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/utils/dbConnect';
import Patient from '@/app/models/Patient';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const patients = await Patient.find({});
    return NextResponse.json({ success: true, data: patients }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch patients' }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await dbConnect();
    const patient = await Patient.create(body);
    return NextResponse.json({ success: true, data: patient }, { status: 201 });
  } catch (error) {
    console.error('Failed to create patient:', error);
    return NextResponse.json({ success: false, message: 'Failed to create patient' }, { status: 400 });
  }
}