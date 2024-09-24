import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { createRouter, expressWrapper } from 'next-connect';
import multer from 'multer';
import dbConnect from '@/app/utils/dbConnect';
import Patient from '@/app/models/Patient';

interface MulterRequest extends NextApiRequest {
  file: Express.Multer.File;
}

// Configure Multer storage
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads/xrays',
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
});

const apiRoute = createRouter<MulterRequest, NextApiResponse>();

apiRoute.use(expressWrapper(upload.single('xrayImage')) as unknown as NextApiHandler);

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

apiRoute.all((req, res) => {
  res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default apiRoute.handler();