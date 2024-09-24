'use client';

import { useAuth } from '@/app/utils/auth';
import { useEffect, useState } from 'react';
import PatientTable from '@/app/components/Dashboard/PatientTable';
import AddPatientForm from '@/app/components/Dashboard/AddPatientForm';

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

export default function DashboardPage() {
  const { session, status } = useAuth('RT');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPatients();
    }
  }, [status]);

  const fetchPatients = async () => {
    const res = await fetch('/api/patients');
    const data = await res.json();
    if (data.success) {
      setPatients(data.data);
    }
  };

  const handleAddPatient = (patient: Patient) => {
    setPatients([...patients, patient]);
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!session) {
    return <div className="flex justify-center items-center h-screen">Access denied. Please log in.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
            >
              Add Patient
            </button>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <PatientTable patients={patients} refresh={fetchPatients} />
          </div>
        </div>
      </div>
      {showForm && <AddPatientForm onClose={() => setShowForm(false)} onAdd={handleAddPatient} />}
    </div>
  );
}