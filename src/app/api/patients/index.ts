// Implement API routes to handle CRUD operations for patients.

import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/utils/dbConnect';
import Patient, { IPatient } from '@/app/models/Patient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const patients: IPatient[] = await Patient.find({});
        res.status(200).json({ success: true, data: patients });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to fetch patients' });
      }
      break;
    case 'POST':
      try {
        const patient = await Patient.create(req.body);
        res.status(201).json({ success: true, data: patient });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to create patient' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}