import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/utils/dbConnect';
import Patient from '@/app/models/Patient';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const patients = await Patient.find({});
    return NextResponse.json({ success: true, data: patients });
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch patients' }, { status: 500 });
  }
}