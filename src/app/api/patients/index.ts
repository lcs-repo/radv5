import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/utils/dbConnect';
import Patient from '@/app/models/Patient';

export async function GET(req: NextRequest) {
  console.log('GET /api/patients route hit');
  try {
    await dbConnect();
    console.log('Database connected');
    const patients = await Patient.find({});
    console.log('Patients fetched:', patients.length);
    return NextResponse.json({ success: true, data: patients });
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch patients' }, { status: 500 });
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