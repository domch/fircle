import React from 'react';
import useStore from '../store';

export default function Home() {
  const count = useStore(state => state.count);
  const increment = useStore(state => state.increment);
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Fircles</h1>
      <p>Count: {count}</p>
      <button className="px-2 py-1 bg-blue-500 text-white" onClick={increment}>
        Increment
      </button>
    </main>
  );
}
