import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Fircle {
  id: number;
  name: string;
}

export default function Dashboard() {
  const [fircles, setFircles] = useState<Fircle[]>([]);
  const [name, setName] = useState('');
  const router = useRouter();

  const loadFircles = async () => {
    try {
      const res = await fetch('/api/fircles');
      if (res.ok) {
        setFircles(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createFircle = async () => {
    try {
      await fetch('/api/fircles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      setName('');
      loadFircles();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadFircles();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Fircles</h1>
      <div className="mb-4 flex space-x-2">
        <input
          className="border p-2 flex-1"
          placeholder="New fircle name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-500 text-white" onClick={createFircle}>
          Create
        </button>
      </div>
      <ul className="space-y-2">
        {fircles.map((f) => (
          <li key={f.id} className="border p-2 flex justify-between">
            <span>{f.name}</span>
            <button
              className="text-blue-500"
              onClick={() => router.push(`/fircle/${f.id}`)}
            >
              Open
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
