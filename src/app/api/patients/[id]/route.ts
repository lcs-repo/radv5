import { NextResponse } from 'next/server';
import Patient from '@/app/models/Patient';
import dbConnect from '@/app/utils/dbConnect';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;
    const patient = await Patient.findById(id);

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error: any) {
    console.error('Failed to fetch patient:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();

    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPatient);
  } catch (error: any) {
    console.error('Failed to update patient:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}