'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface Props {
  onClose: () => void;
  onAdd: (patient: any) => void;
}

export default function AddPatientForm({ onClose, onAdd }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    requestedBy: '',
    examinationDone: '',
    caseNo: '',
    datePerformed: '',
    sex: 'Male',
    birthday: '',
    age: 0,
    xrayImage: null as File | null,
  });

  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: type === 'number' ? parseInt(value) : value,
      };
      if (name === 'birthday') {
        updatedFormData.age = calculateAge(value);
      }
      return updatedFormData;
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        xrayImage: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    // Append text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'xrayImage') {
        data.append(key, value.toString());
      }
    });

    // Append file
    if (formData.xrayImage) {
      data.append('xrayImage', formData.xrayImage);
    }

    try {
      const res = await fetch('/api/patients/upload', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        const response = await res.json();
        onAdd(response.data);
        onClose();
      } else {
        const errorData = await res.json();
        console.error('Error adding patient:', errorData.message);
        // Handle error, e.g., show message to user
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle network or other errors
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Patient</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="requestedBy" className="block text-sm font-medium text-gray-700">Requested By</label>
              <input
                type="text"
                id="requestedBy"
                name="requestedBy"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
                value={formData.requestedBy}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="examinationDone" className="block text-sm font-medium text-gray-700">Examination Done</label>
              <input
                type="text"
                id="examinationDone"
                name="examinationDone"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
                value={formData.examinationDone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="caseNo" className="block text-sm font-medium text-gray-700">Case No</label>
              <input
                type="text"
                id="caseNo"
                name="caseNo"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
                value={formData.caseNo}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="datePerformed" className="block text-sm font-medium text-gray-700">Date Performed</label>
              <input
                type="date"
                id="datePerformed"
                name="datePerformed"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
                value={formData.datePerformed}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sex</label>
              <select
                id="sex"
                name="sex"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
                value={formData.sex}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">Birthday</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
                value={formData.birthday}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
                value={formData.age}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="xrayImage" className="block text-sm font-medium text-gray-700">X-Ray Image (JPEG)</label>
              <input
                type="file"
                id="xrayImage"
                name="xrayImage"
                accept="image/jpeg"
                required
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}