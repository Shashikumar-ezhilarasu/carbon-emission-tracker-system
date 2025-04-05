'use client';

import { useEffect, useState } from 'react';
import { addVehicle, getVehicles, deleteVehicle } from '@/lib/firebaseConfig';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [form, setForm] = useState({ 
    make: '', 
    model: '', 
    year: '', 
    fuelType: '', 
    emissions: 0 
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const data = await getVehicles();
    setVehicles(data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await addVehicle(form);
    fetchVehicles();
    setForm({ make: '', model: '', year: '', fuelType: '', emissions: 0 });
  };

  const handleDelete = async (id: string) => {
    await deleteVehicle(id);
    fetchVehicles();
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Vehicle</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full p-2 border" placeholder="Make" value={form.make}
          onChange={e => setForm({ ...form, make: e.target.value })} />
        <input className="w-full p-2 border" placeholder="Model" value={form.model}
          onChange={e => setForm({ ...form, model: e.target.value })} />
        <input className="w-full p-2 border" placeholder="Year" value={form.year}
          onChange={e => setForm({ ...form, year: e.target.value })} />
        <input className="w-full p-2 border" placeholder="Fuel Type" value={form.fuelType}
          onChange={e => setForm({ ...form, fuelType: e.target.value })} />
        <input type="number" className="w-full p-2 border" placeholder="Emissions (g/km)"
          value={form.emissions} onChange={e => setForm({ ...form, emissions: +e.target.value })} />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
      </form>

      <h2 className="text-xl font-bold mt-8 mb-4">Vehicles List</h2>
      <ul className="space-y-2">
        {vehicles.map(item => (
          <li key={item.id} className="border p-2 flex justify-between items-center rounded bg-white">
            <div>
              <p><b>Make:</b> {item.make}</p>
              <p><b>Model:</b> {item.model}</p>
              <p><b>Year:</b> {item.year}</p>
              <p><b>Fuel Type:</b> {item.fuelType}</p>
              <p><b>Emissions:</b> {item.emissions} g/km</p>
            </div>
            <button onClick={() => handleDelete(item.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 