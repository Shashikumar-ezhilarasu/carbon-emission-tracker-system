'use client';
import { useEffect, useState } from 'react';
import { addEmission, getEmissions, deleteEmission, updateEmission } from '@/lib/firebaseConfig';
import Link from 'next/link';

export default function Home() {
  const [emissions, setEmissions] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getEmissions();
    setEmissions(data);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Carbon Emission Tracker</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/emissions" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Emissions</h2>
            <p className="text-gray-600">Track and manage carbon emissions from various activities.</p>
          </Link>

          <Link href="/users" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Users</h2>
            <p className="text-gray-600">Manage user accounts and their roles in the system.</p>
          </Link>

          <Link href="/vehicles" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Vehicles</h2>
            <p className="text-gray-600">Track vehicle information and their emission levels.</p>
          </Link>

          <Link href="/recommendations" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Recommendations</h2>
            <p className="text-gray-600">View and manage emission reduction recommendations.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
