'use client';

import { useEffect, useState } from 'react';
import ReportPDF from '@/app/components/Reports/ReportPDF';

export default function ReportPage({ params }: { params: { id: string } }) {
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`/api/patients/${params.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPatient(data);
      } catch (e) {
        console.error('Error fetching patient:', e);
        setError('Failed to fetch patient data. Please try again later.');
      }
    };
    fetchPatient();
  }, [params.id]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!patient) {
    return <div>Loading...</div>;
  }

  return <ReportPDF patient={patient} />;
}