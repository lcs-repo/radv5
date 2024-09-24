'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from '../Reports/ReportPDF';
import { usePDF } from '@react-pdf/renderer';

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
    <table className="min-w-full border">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Address</th>
          <th className="border px-4 py-2">Requested By</th>
          <th className="border px-4 py-2">Examination Done</th>
          <th className="border px-4 py-2">Case No</th>
          <th className="border px-4 py-2">Date Performed</th>
          <th className="border px-4 py-2">Sex</th>
          <th className="border px-4 py-2">Birthday</th>
          <th className="border px-4 py-2">Age</th>
          <th className="border px-4 py-2">X-Ray Image</th>
          <th className="border px-4 py-2">Report by Radiologist</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => (
          <tr key={patient._id} className="text-center">
            <td className="border px-4 py-2">{patient.name}</td>
            <td className="border px-4 py-2">{patient.address}</td>
            <td className="border px-4 py-2">{patient.requestedBy}</td>
            <td className="border px-4 py-2">{patient.examinationDone}</td>
            <td className="border px-4 py-2">{patient.caseNo}</td>
            <td className="border px-4 py-2">{new Date(patient.datePerformed).toLocaleDateString()}</td>
            <td className="border px-4 py-2">{patient.sex}</td>
            <td className="border px-4 py-2">{new Date(patient.birthday).toLocaleDateString()}</td>
            <td className="border px-4 py-2">{patient.age}</td>
            <td className="border px-4 py-2">
              <Image src={patient.xrayImage} alt="X-Ray" width={50} height={50} />
            </td>
            <td className="border px-4 py-2">{patient.report || 'Pending'}</td>
            <td className="border px-4 py-2">
              {session?.user?.role === 'Radiologist' && !patient.validated && (
                <button
                  onClick={() => validateReport(patient._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Validate
                </button>
              )}
              {session?.user?.role === 'RT' && patient.validated && (
                <button
                  onClick={() => {
                    const [instance, updateInstance] = usePDF({ document: <ReportPDF patient={patient} /> });
                    if (instance.url) {
                      const link = document.createElement('a');
                      link.href = instance.url;
                      link.setAttribute('download', `Report-${patient.caseNo}.pdf`);
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                    }
                  }}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Print
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}