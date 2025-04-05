'use client';

import { useEffect, useState } from 'react';
import { addEmission, getEmissions, updateEmission, deleteEmission } from '@/lib/firebaseConfig';

export default function EmissionsPage() {
  const [emissions, setEmissions] = useState<any[]>([]);
  const [form, setForm] = useState({
    userId: '',
    activityType: '',
    amount: 0,
    unit: 'kg',
    category: '',
    description: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEmissions();
  }, []);

  const fetchEmissions = async () => {
    const data = await getEmissions();
    setEmissions(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const emissionData = {
        ...form,
        timestamp: new Date()
      };

      if (editingId) {
        await updateEmission(editingId, emissionData);
        setEditingId(null);
      } else {
        await addEmission(emissionData);
      }

      fetchEmissions();
      resetForm();
    } catch (error) {
      console.error('Error saving emission:', error);
    }
  };

  const handleEdit = (emission: any) => {
    setForm({
      userId: emission.userId,
      activityType: emission.activityType,
      amount: emission.amount,
      unit: emission.unit,
      category: emission.category,
      description: emission.description || ''
    });
    setEditingId(emission.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this emission?')) {
      await deleteEmission(id);
      fetchEmissions();
    }
  };

  const resetForm = () => {
    setForm({
      userId: '',
      activityType: '',
      amount: 0,
      unit: 'kg',
      category: '',
      description: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Emissions Management</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Emission' : 'Add New Emission'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <input
              type="text"
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Activity Type</label>
            <select
              value={form.activityType}
              onChange={(e) => setForm({ ...form, activityType: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select type</option>
              <option value="Transportation">Transportation</option>
              <option value="Energy">Energy</option>
              <option value="Daily Habits">Daily Habits</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="kg">kg CO₂</option>
              <option value="tonnes">tonnes CO₂</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select category</option>
              <option value="Direct">Direct Emissions</option>
              <option value="Indirect">Indirect Emissions</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {editingId ? 'Update Emission' : 'Add Emission'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                resetForm();
              }}
              className="ml-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xl font-semibold p-6 border-b">Emissions List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emissions.map((emission) => (
                <tr key={emission.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{emission.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emission.activityType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emission.amount} {emission.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emission.category}</td>
                  <td className="px-6 py-4">{emission.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {emission.timestamp?.toDate().toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(emission)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emission.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
