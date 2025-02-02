'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from '../Reports/ReportPDF';
import Link from 'next/link';

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
  report?: {
    findings: string;
    impression: string;
  };
  validated: boolean;
}

interface PatientTableProps {
  patients: Patient[];
  refresh: () => void;
}

export default function PatientTable({ patients, refresh }: PatientTableProps) {
  const { data: session } = useSession();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [findings, setFindings] = useState('');
  const [impression, setImpression] = useState('');
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const validateReport = async (patientId: string) => {
    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ validated: true }),
      });
      if (res.ok) {
        refresh();
      } else {
        console.error('Failed to validate report');
      }
    } catch (error) {
      console.error('Error validating report:', error);
    }
  };

  const invalidateReport = async (patientId: string) => {
    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ validated: false }),
      });
      if (res.ok) {
        refresh();
      } else {
        console.error('Failed to invalidate report');
      }
    } catch (error) {
      console.error('Error invalidating report:', error);
    }
  };

  const openReportModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setFindings(patient.report?.findings || '');
    setImpression(patient.report?.impression || '');
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setSelectedPatient(null);
    setIsReportModalOpen(false);
  };

  const handleReportSubmit = async () => {
    if (selectedPatient) {
      try {
        const response = await fetch(`/api/patients/${selectedPatient._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            report: {
              findings,
              impression,
            },
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to update report:', errorData);
          // TODO: Show an error message to the user
        } else {
          closeReportModal();
          refresh();
        }
      } catch (error) {
        console.error('Error updating report:', error);
        // TODO: Show an error message to the user
      }
    }
  };

  const openImagePopup = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setIsImagePopupOpen(true);
  };

  const handleNormalChestPA = () => {
    setFindings("Lungs are clear.\nHeart is not enlarged.\nAorta is not dilated.\nDiaphragm and sulci are intact.\nThe rest of the visualized chest structures are unremarkable.");
    setImpression("No significant chest finding");
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
              invalidateReport={invalidateReport}
              openReportModal={openReportModal}
              openImagePopup={openImagePopup}
            />
          ))}
        </tbody>
      </table>

      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-black">
              {selectedPatient?.report ? 'Edit Report' : 'Add Report'}
            </h2>
            <button
              onClick={handleNormalChestPA}
              className="mb-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-150 ease-in-out"
            >
              Normal Chest PA
            </button>
            <div className="mb-4">
              <label htmlFor="findings" className="block text-sm font-medium text-gray-700 mb-2">
                Findings
              </label>
              <textarea
                id="findings"
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                className="w-full h-40 p-2 border rounded mb-4 text-black"
                placeholder="Enter findings here..."
              />
            </div>
            <div className="mb-4">
              <label htmlFor="impression" className="block text-sm font-medium text-gray-700 mb-2">
                Impression
              </label>
              <textarea
                id="impression"
                value={impression}
                onChange={(e) => setImpression(e.target.value)}
                className="w-full h-40 p-2 border rounded mb-4 text-black"
                placeholder="Enter impression here..."
              />
            </div>
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

      {isImagePopupOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-3xl max-h-[90vh] overflow-auto">
            <Image
              src={selectedImage}
              alt="X-Ray"
              width={800}
              height={800}
              className="object-contain"
            />
            <button
              onClick={() => setIsImagePopupOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface PatientRowProps {
  patient: Patient;
  session: Session | null;
  validateReport: (patientId: string) => void;
  invalidateReport: (patientId: string) => void;
  openReportModal: (patient: Patient) => void;
  openImagePopup: (imageSrc: string) => void;
}

function PatientRow({ 
  patient, 
  session, 
  validateReport, 
  invalidateReport, 
  openReportModal,
  openImagePopup
}: PatientRowProps) {
  return (
    <tr className={`${patient.validated ? 'bg-green-100' : ''}`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.address}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.requestedBy}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.examinationDone}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.caseNo}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(patient.datePerformed).toLocaleDateString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.sex}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.age}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <Image 
          src={patient.xrayImage} 
          alt="X-Ray" 
          width={50} 
          height={50} 
          className="rounded-md cursor-pointer" 
          onClick={() => openImagePopup(patient.xrayImage)}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button
          onClick={() => openReportModal(patient)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-150 ease-in-out
            ${patient.validated 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-100 text-blue-700'}`}
          disabled={patient.validated}
        >
          {patient.report ? 'Edit Report' : 'Add Report'}
        </button>
        {session?.user?.role === 'Radiologist' && (
          <>
            {!patient.validated ? (
              <button
                onClick={() => validateReport(patient._id)}
                className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 transition-colors duration-150 ease-in-out"
              >
                Validate
              </button>
            ) : (
              <button
                onClick={() => invalidateReport(patient._id)}
                className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 transition-colors duration-150 ease-in-out"
              >
                Invalidate
              </button>
            )}
          </>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {session?.user?.role === 'RT' && patient.validated && (
          <Link href={`/report/${patient._id}`} target="_blank">
            <button className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 transition-colors duration-150 ease-in-out">
              View Report
            </button>
          </Link>
        )}
      </td>
    </tr>
  );
}