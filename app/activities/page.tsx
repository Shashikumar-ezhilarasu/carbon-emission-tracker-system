'use client';

import { useEffect, useState } from 'react';
import { addActivity, getActivities, updateActivity, deleteActivity } from '@/lib/firebaseConfig';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [form, setForm] = useState({
    userId: '',
    activityType: '',
    details: {
      mode: '',
      distance: '',
      unit: 'km',
      source: '',
      usage: '',
      type: '',
      description: ''
    },
    carbonEmissions: 0
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const data = await getActivities();
    setActivities(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const activityData = {
        ...form,
        timestamp: new Date(),
        details: {
          ...form.details,
          distance: form.details.distance ? parseFloat(form.details.distance) : null,
          usage: form.details.usage ? parseFloat(form.details.usage) : null
        }
      };

      if (editingId) {
        await updateActivity(editingId, activityData);
        setEditingId(null);
      } else {
        await addActivity(activityData);
      }

      fetchActivities();
      resetForm();
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const handleEdit = (activity: any) => {
    setForm({
      userId: activity.userId,
      activityType: activity.activityType,
      details: {
        mode: activity.details?.mode || '',
        distance: activity.details?.distance?.toString() || '',
        unit: activity.details?.unit || 'km',
        source: activity.details?.source || '',
        usage: activity.details?.usage?.toString() || '',
        type: activity.details?.type || '',
        description: activity.details?.description || ''
      },
      carbonEmissions: activity.carbonEmissions
    });
    setEditingId(activity.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      await deleteActivity(id);
      fetchActivities();
    }
  };

  const resetForm = () => {
    setForm({
      userId: '',
      activityType: '',
      details: {
        mode: '',
        distance: '',
        unit: 'km',
        source: '',
        usage: '',
        type: '',
        description: ''
      },
      carbonEmissions: 0
    });
  };

  const renderActivityDetails = () => {
    switch (form.activityType) {
      case 'Transportation':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mode of Transport</label>
              <select
                value={form.details.mode}
                onChange={(e) => setForm({
                  ...form,
                  details: { ...form.details, mode: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select mode</option>
                <option value="car">Car</option>
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="plane">Plane</option>
                <option value="bike">Bike</option>
                <option value="walk">Walk</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Distance</label>
              <input
                type="number"
                value={form.details.distance}
                onChange={(e) => setForm({
                  ...form,
                  details: { ...form.details, distance: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Unit</label>
              <select
                value={form.details.unit}
                onChange={(e) => setForm({
                  ...form,
                  details: { ...form.details, unit: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="km">Kilometers</option>
                <option value="miles">Miles</option>
              </select>
            </div>
          </>
        );
      case 'Energy':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Energy Source</label>
              <select
                value={form.details.source}
                onChange={(e) => setForm({
                  ...form,
                  details: { ...form.details, source: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select source</option>
                <option value="electricity">Electricity</option>
                <option value="gas">Natural Gas</option>
                <option value="oil">Oil</option>
                <option value="solar">Solar</option>
                <option value="wind">Wind</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Usage</label>
              <input
                type="number"
                value={form.details.usage}
                onChange={(e) => setForm({
                  ...form,
                  details: { ...form.details, usage: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </>
        );
      case 'Daily Habits':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Habit Type</label>
              <select
                value={form.details.type}
                onChange={(e) => setForm({
                  ...form,
                  details: { ...form.details, type: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="diet">Diet</option>
                <option value="waste">Waste</option>
                <option value="shopping">Shopping</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={form.details.description}
                onChange={(e) => setForm({
                  ...form,
                  details: { ...form.details, description: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Activity Management</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Activity' : 'Add New Activity'}
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
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderActivityDetails()}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Carbon Emissions (kg CO₂)</label>
          <input
            type="number"
            value={form.carbonEmissions}
            onChange={(e) => setForm({ ...form, carbonEmissions: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {editingId ? 'Update Activity' : 'Add Activity'}
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
        <h3 className="text-xl font-semibold p-6 border-b">Activity List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emissions
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
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{activity.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{activity.activityType}</td>
                  <td className="px-6 py-4">
                    {JSON.stringify(activity.details)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{activity.carbonEmissions} kg CO₂</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {activity.timestamp?.toDate().toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(activity)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(activity.id)}
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