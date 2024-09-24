'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from '../Reports/ReportPDF';

interface Patient {
  _id: string;
  name: string;
  address: string;
  requestedBy: string;
  examinationDone: string;
  caseNo: string;
  datePerformed: string;
  sex: string;
  birthday: string;
  age: number;
  xrayImage: string;
  report?: string;
  validated: boolean;
}

interface Props {
  patients: Patient[];
  refresh: () => void;
}

export default function PatientTable({ patients, refresh }: Props) {
  const { data: session } = useSession();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const validateReport = async (id: string) => {
    await fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ validated: true }),
    });
    refresh();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Name', 'Address', 'Requested By', 'Examination', 'Case No', 'Date', 'Sex', 'Age', 'X-Ray', 'Report', 'Actions'].map((header) => (
              <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map((patient) => (
            <PatientRow key={patient._id} patient={patient} session={session} validateReport={validateReport} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface PatientRowProps {
  patient: Patient;
  session: any;
  validateReport: (id: string) => void;
}

function PatientRow({ patient, session, validateReport }: PatientRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.address}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.requestedBy}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.examinationDone}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.caseNo}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(patient.datePerformed).toLocaleDateString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.sex}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.age}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <Image src={patient.xrayImage} alt="X-Ray" width={50} height={50} className="rounded-md" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.report || 'Pending'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {session?.user?.role === 'Radiologist' && !patient.validated && (
          <button
            onClick={() => validateReport(patient._id)}
            className="text-blue-600 hover:text-blue-900 mr-2"
          >
            Validate
          </button>
        )}
        {session?.user?.role === 'RT' && patient.validated && (
          <PDFDownloadLink document={<ReportPDF patient={patient} />} fileName={`Report-${patient.caseNo}.pdf`}>
            {({ loading }) => (
              <button className="text-green-600 hover:text-green-900">
                {loading ? 'Preparing...' : 'Download PDF'}
              </button>
            )}
          </PDFDownloadLink>
        )}
      </td>
    </tr>
  );
}