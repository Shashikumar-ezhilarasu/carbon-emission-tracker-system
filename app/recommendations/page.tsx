'use client';

import { useEffect, useState } from 'react';
import { addRecommendation, getRecommendations, updateRecommendation, deleteRecommendation } from '@/lib/firebaseConfig';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    userId: '',
    category: '',
    recommendationText: '',
    impactEstimate: 0,
    status: 'Pending'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quickRecommendation, setQuickRecommendation] = useState<string>('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    const data = await getRecommendations();
    setRecommendations(data);
  };

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate recommendations');
      }
      
      const data = await response.json();
      await fetchRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuickRecommendation = () => {
    const recommendations = [
      "Great job! Your carbon footprint is below average. Keep up the sustainable habits!",
      "Your transportation choices are eco-friendly. Consider carpooling to reduce emissions further.",
      "Excellent energy usage patterns. Try switching to LED bulbs for even more savings.",
      "Your diet choices are sustainable. Consider reducing meat consumption to lower your carbon footprint.",
      "Your shopping habits are environmentally conscious. Keep supporting local and sustainable products.",
      "Your daily habits are making a positive impact. Consider using reusable containers to reduce waste.",
      "Your energy consumption is efficient. Try using natural light during the day to save more energy.",
      "Your transportation emissions are low. Consider biking or walking for short distances.",
      "Your waste management is effective. Try composting organic waste to reduce landfill contribution.",
      "Your water usage is sustainable. Consider installing low-flow fixtures to conserve more water."
    ];
    const randomRecommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
    setQuickRecommendation(randomRecommendation);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const recommendationData = {
        ...form,
        timestamp: new Date()
      };

      if (editingId) {
        await updateRecommendation(editingId, recommendationData);
        setEditingId(null);
      } else {
        await addRecommendation(recommendationData);
      }

      fetchRecommendations();
      resetForm();
    } catch (error) {
      console.error('Error saving recommendation:', error);
    }
  };

  const handleEdit = (recommendation: any) => {
    setForm({
      userId: recommendation.userId,
      category: recommendation.category,
      recommendationText: recommendation.recommendationText,
      impactEstimate: recommendation.impactEstimate,
      status: recommendation.status
    });
    setEditingId(recommendation.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this recommendation?')) {
      await deleteRecommendation(id);
      fetchRecommendations();
    }
  };

  const resetForm = () => {
    setForm({
      userId: '',
      category: '',
      recommendationText: '',
      impactEstimate: 0,
      status: 'Pending'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Recommendations Management</h2>
          <div className="flex space-x-4">
            <button
              onClick={generateQuickRecommendation}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Get Quick Tip
            </button>
            <button
              onClick={generateRecommendations}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Recommendations'
              )}
            </button>
          </div>
        </div>

        {quickRecommendation && (
          <div className="mb-8 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  {quickRecommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingId ? 'Edit Recommendation' : 'Add New Recommendation'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="userId" className="block text-sm font-medium text-gray-900">
                    User ID
                  </label>
                  <input
                    type="text"
                    id="userId"
                    value={form.userId}
                    onChange={(e) => setForm({ ...form, userId: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-900">
                    Category
                  </label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Energy">Energy</option>
                    <option value="Daily Habits">Daily Habits</option>
                    <option value="Diet">Diet</option>
                    <option value="Shopping">Shopping</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="recommendationText" className="block text-sm font-medium text-gray-900">
                    Recommendation Text
                  </label>
                  <textarea
                    id="recommendationText"
                    value={form.recommendationText}
                    onChange={(e) => setForm({ ...form, recommendationText: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="impactEstimate" className="block text-sm font-medium text-gray-900">
                    Impact Estimate (kg CO₂)
                  </label>
                  <input
                    type="number"
                    id="impactEstimate"
                    step="0.01"
                    value={form.impactEstimate}
                    onChange={(e) => setForm({ ...form, impactEstimate: parseFloat(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-900">
                    Status
                  </label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      resetForm();
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {editingId ? 'Update Recommendation' : 'Add Recommendation'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recommendations List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    User ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Recommendation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Impact Estimate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recommendations.map((recommendation) => (
                  <tr key={recommendation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {recommendation.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {recommendation.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {recommendation.recommendationText}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {recommendation.impactEstimate} kg CO₂
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        recommendation.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        recommendation.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        recommendation.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {recommendation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {recommendation.timestamp?.toDate().toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(recommendation)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(recommendation.id)}
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
    </div>
  );
} 