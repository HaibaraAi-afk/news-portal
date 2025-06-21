import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/layout-admin';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    request: 0,
    active: 0,
    authors: 0,
  });

  useEffect(() => {
    axios.get('/dashboard/admin/stats')
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Failed to fetch stats:', err));
  }, []);

  return (
    <Layout>
      <h1 className="text-xl text-black font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-4 gap-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg text-black font-semibold capitalize">{key}</h2>
            <p className="text-2xl text-black font-bold">{value}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
