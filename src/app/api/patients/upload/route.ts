import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/utils/dbConnect';
import Patient from '@/app/models/Patient';
import { writeFile } from 'fs/promises';
import path from 'path';

// Specify that this API route uses the Node.js runtime
export const runtime = 'nodejs';

// Disable the default body parser to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const patientData: any = {};

    // Extract text fields
    for (const [key, value] of formData.entries()) {
      if (key !== 'xrayImage') {
        patientData[key] = value;
      }
    }

    // Handle file upload
    const file = formData.get('xrayImage') as File | null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public/uploads/xrays');
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      patientData.xrayImage = `/uploads/xrays/${fileName}`;
    }

    // Create new patient
    const patient = await Patient.create(patientData);

    return NextResponse.json({ success: true, data: patient }, { status: 201 });
  } catch (error) {
    console.error('Failed to add patient:', error);
    return NextResponse.json({ success: false, message: 'Failed to add patient' }, { status: 400 });
  }
}