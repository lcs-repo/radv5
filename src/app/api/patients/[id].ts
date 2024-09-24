// Get, Update, and Validate a Specific Patient

import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/utils/dbConnect';
import Patient from '@/app/models/Patient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        res.status(200).json({ success: true, data: patient });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to fetch patient' });
      }
      break;
    case 'PUT':
      try {
        const patient = await Patient.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!patient) {
          return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        res.status(200).json({ success: true, data: patient });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to update patient' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}