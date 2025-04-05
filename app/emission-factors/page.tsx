'use client';

import { useEffect, useState } from 'react';
import { addEmissionFactor, getEmissionFactors, updateEmissionFactor, deleteEmissionFactor } from '@/lib/firebaseConfig';

export default function EmissionFactorsPage() {
  const [factors, setFactors] = useState<any[]>([]);
  const [form, setForm] = useState({
    activityType: '',
    subCategory: '',
    unit: '',
    emissionFactor: 0,
    source: '',
    lastUpdated: new Date()
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFactors();
  }, []);

  const fetchFactors = async () => {
    const data = await getEmissionFactors();
    setFactors(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const factorData = {
        ...form,
        lastUpdated: new Date()
      };

      if (editingId) {
        await updateEmissionFactor(editingId, factorData);
        setEditingId(null);
      } else {
        await addEmissionFactor(factorData);
      }

      fetchFactors();
      resetForm();
    } catch (error) {
      console.error('Error saving emission factor:', error);
    }
  };

  const handleEdit = (factor: any) => {
    setForm({
      activityType: factor.activityType,
      subCategory: factor.subCategory,
      unit: factor.unit,
      emissionFactor: factor.emissionFactor,
      source: factor.source,
      lastUpdated: factor.lastUpdated?.toDate() || new Date()
    });
    setEditingId(factor.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this emission factor?')) {
      await deleteEmissionFactor(id);
      fetchFactors();
    }
  };

  const resetForm = () => {
    setForm({
      activityType: '',
      subCategory: '',
      unit: '',
      emissionFactor: 0,
      source: '',
      lastUpdated: new Date()
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Emission Factors Management</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Emission Factor' : 'Add New Emission Factor'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700">Sub-Category</label>
            <input
              type="text"
              value={form.subCategory}
              onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <input
              type="text"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Emission Factor (kg CO₂ per unit)</label>
            <input
              type="number"
              step="0.01"
              value={form.emissionFactor}
              onChange={(e) => setForm({ ...form, emissionFactor: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Source</label>
            <input
              type="text"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {editingId ? 'Update Factor' : 'Add Factor'}
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
        <h3 className="text-xl font-semibold p-6 border-b">Emission Factors List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sub-Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emission Factor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {factors.map((factor) => (
                <tr key={factor.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{factor.activityType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{factor.subCategory}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{factor.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{factor.emissionFactor} kg CO₂/{factor.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{factor.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {factor.lastUpdated?.toDate().toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(factor)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(factor.id)}
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