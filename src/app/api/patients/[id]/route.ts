import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/utils/dbConnect';
import Patient from '@/app/models/Patient';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { id } = params;
    const body = await req.json();

    const updatedPatient = await Patient.findByIdAndUpdate(id, body, { new: true });

    if (!updatedPatient) {
      return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedPatient });
  } catch (error) {
    console.error('Failed to update patient:', error);
    return NextResponse.json({ success: false, message: 'Failed to update patient' }, { status: 400 });
  }
}