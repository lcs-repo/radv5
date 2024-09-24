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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
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
    Object.keys(formData).forEach((key) => {
      // @ts-ignore
      data.append(key, formData[key]);
    });

    const res = await fetch('/api/patients/upload', {
      method: 'POST',
      body: data,
    });

    const result = await res.json();
    if (result.success) {
      onAdd(result.data);
      onClose();
    } else {
      alert('Failed to add patient');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md max-w-lg w-full overflow-y-auto max-h-full"
      >
        <h2 className="mb-4 text-xl font-semibold">Add New Patient</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              required
              className="w-full border px-2 py-1 rounded"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              required
              className="w-full border px-2 py-1 rounded"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Requested By:</label>
            <input
              type="text"
              name="requestedBy"
              required
              className="w-full border px-2 py-1 rounded"
              value={formData.requestedBy}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Examination Done:</label>
            <input
              type="text"
              name="examinationDone"
              required
              className="w-full border px-2 py-1 rounded"
              value={formData.examinationDone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Case No:</label>
            <input
              type="text"
              name="caseNo"
              required
              className="w-full border px-2 py-1 rounded"
              value={formData.caseNo}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Date Performed:</label>
            <input
              type="date"
              name="datePerformed"
              required
              className="w-full border px-2 py-1 rounded"
              value={formData.datePerformed}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Sex:</label>
            <select
              name="sex"
              required
              className="w-full border px-2 py-1 rounded"
              value={formData.sex}
              onChange={handleChange}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label>Birthday:</label>
            <input
              type="date"
              name="birthday"
              required
              className="w-full border px-2 py-1 rounded"
              value={formData.birthday}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Age:</label>
            <input
              type="number"
              name="age"
              required
              className="w-full border px-2 py-1 rounded"
              value={formData.age}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <label>X-Ray Image (JPEG):</label>
            <input
              type="file"
              name="xrayImage"
              accept="image/jpeg"
              required
              className="w-full"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}