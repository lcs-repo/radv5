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
  const [reportText, setReportText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validateReport = async (id: string) => {
    await fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ validated: true }),
    });
    refresh();
  };

  const openReportModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setReportText(patient.report || '');
    setIsModalOpen(true);
  };

  const closeReportModal = () => {
    setSelectedPatient(null);
    setReportText('');
    setIsModalOpen(false);
  };

  const handleReportSubmit = async () => {
    if (selectedPatient) {
      await fetch(`/api/patients/${selectedPatient._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report: reportText }),
      });
      closeReportModal();
      refresh();
    }
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
            <PatientRow
              key={patient._id}
              patient={patient}
              session={session}
              validateReport={validateReport}
              openReportModal={openReportModal}
            />
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-black">
              {selectedPatient?.report ? 'Edit Report' : 'Add Report'}
            </h2>
            <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="w-full h-40 p-2 border rounded mb-4 text-black"
                placeholder="Enter report here..."
                />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeReportModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface PatientRowProps {
  patient: Patient;
  session: any;
  validateReport: (id: string) => void;
  openReportModal: (patient: Patient) => void;
}

function PatientRow({ 
  patient, 
  session, 
  validateReport, 
  openReportModal 
}: PatientRowProps) {
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
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button
          onClick={() => openReportModal(patient)}
          className="text-blue-600 hover:text-blue-900"
        >
          {patient.report ? 'Edit Report' : 'Add Report'}
        </button>
        {session?.user?.role === 'Radiologist' && !patient.validated && (
          <button
            onClick={() => validateReport(patient._id)}
            className="ml-2 text-green-600 hover:text-green-900"
          >
            Validate
          </button>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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