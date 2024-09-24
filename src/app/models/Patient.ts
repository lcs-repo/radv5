// Define the Patient model to store patient information

import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPatient extends Document {
  name: string;
  address: string;
  requestedBy: string;
  examinationDone: string;
  caseNo: string;
  datePerformed: Date;
  sex: 'Male' | 'Female' | 'Other';
  birthday: Date;
  age: number;
  xrayImage: string; // URL or file path
  report: string;
  validated: boolean;
}

const PatientSchema: Schema<IPatient> = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  requestedBy: { type: String, required: true },
  examinationDone: { type: String, required: true },
  caseNo: { type: String, required: true, unique: true },
  datePerformed: { type: Date, required: true },
  sex: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  birthday: { type: Date, required: true },
  age: { type: Number, required: true },
  xrayImage: { type: String, required: true },
  report: {
    findings: String,
    impression: String
  },
  validated: { type: Boolean, default: false },
}, { timestamps: true });

const Patient: Model<IPatient> = mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);
export default Patient;