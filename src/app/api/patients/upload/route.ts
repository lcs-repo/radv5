import type { NextApiResponse } from 'next';
import { NextRequest } from 'next/server';
import { createRouter, expressWrapper } from 'next-connect';
import multer from 'multer';
import dbConnect from '@/app/utils/dbConnect';
import Patient from '@/app/models/Patient';

// Define a custom request type to include Multer's file
interface MulterRequest extends NextRequest {
  file: Express.Multer.File;
}

// Configure Multer storage
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads/xrays',
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
});

// Initialize the router
const apiRoute = createRouter<MulterRequest, NextApiResponse>();

// Use Multer middleware
apiRoute.use(expressWrapper(upload.single('xrayImage')) as any);

// Define the POST handler
apiRoute.post(async (req: MulterRequest, res: NextApiResponse) => {
  await dbConnect();

  const { name, address, requestedBy, examinationDone, caseNo, datePerformed, sex, birthday, age } = req.body;
  const xrayImage = `/uploads/xrays/${req.file.filename}`;

  try {
    const patient = await Patient.create({
      name,
      address,
      requestedBy,
      examinationDone,
      caseNo,
      datePerformed,
      sex,
      birthday,
      age,
      xrayImage,
    });
    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to add patient' });
  }
});

export const config = {
  runtime: 'edge', // or remove if not using edge functions
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default apiRoute.handler();