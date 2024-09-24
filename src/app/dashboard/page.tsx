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
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Access denied. Please log in.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Patient Dashboard</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Patient
        </button>
      </div>
      <PatientTable patients={patients} refresh={fetchPatients} />
      {showForm && <AddPatientForm onClose={() => setShowForm(false)} onAdd={handleAddPatient} />}
    </div>
  );
}