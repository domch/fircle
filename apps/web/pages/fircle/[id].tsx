import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Member {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
}

export default function FirclePage() {
  const router = useRouter();
  const { id } = router.query;
  const [members, setMembers] = useState<Member[]>([]);
  const [rules, setRules] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/fircles/${id}/members`)
      .then((res) => res.json())
      .then((data) => setMembers(data.members || data))
      .catch(() => {});
    fetch(`/api/items/fircle/${id}`)
      .then((res) => res.json())
      .then(setItems)
      .catch(() => {});
  }, [id]);

  const updateRules = async () => {
    await fetch(`/api/fircles/${id}/rules`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rules }),
    });
  };

  const invite = async () => {
    await fetch(`/api/fircles/${id}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail }),
    });
    setInviteEmail('');
  };

  const addItem = async () => {
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItem, ownerId: 1 }),
    });
    setNewItem('');
    fetch(`/api/items/fircle/${id}`)
      .then((res) => res.json())
      .then(setItems)
      .catch(() => {});
  };

  const requestLend = async (itemId: number) => {
    await fetch(`/api/items/${itemId}/request-lend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestedBy: 1, offerType: 'LEND' }),
    });
  };

  const loadHistory = async (itemId: number) => {
    const res = await fetch(`/api/items/${itemId}/ownership`);
    if (res.ok) {
      alert(JSON.stringify(await res.json()));
    }
  };

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Fircle {id}</h1>

      <section>
        <h2 className="font-semibold">Members</h2>
        <ul className="list-disc list-inside">
          {members.map((m) => (
            <li key={m.id}>{m.name}</li>
          ))}
        </ul>
        <div className="mt-2 flex space-x-2">
          <input
            className="border p-2 flex-1"
            placeholder="Invite email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <button className="px-3 py-1 bg-blue-500 text-white" onClick={invite}>
            Invite
          </button>
        </div>
      </section>

      <section>
        <h2 className="font-semibold">Rules</h2>
        <textarea
          className="border w-full p-2"
          value={rules}
          onChange={(e) => setRules(e.target.value)}
        />
        <button className="mt-2 px-3 py-1 bg-blue-500 text-white" onClick={updateRules}>
          Update Rules
        </button>
      </section>

      <section>
        <h2 className="font-semibold">Items</h2>
        <div className="flex space-x-2 mb-2">
          <input
            className="border p-2 flex-1"
            placeholder="New item name"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button className="px-3 py-1 bg-blue-500 text-white" onClick={addItem}>
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="border p-2 flex justify-between">
              <span>{item.name}</span>
              <div className="space-x-2">
                <button className="text-blue-600" onClick={() => requestLend(item.id)}>
                  Request Lend
                </button>
                <button className="text-gray-600" onClick={() => loadHistory(item.id)}>
                  History
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-semibold">Auctions</h2>
        <p>Coming soon...</p>
      </section>
    </main>
  );
}
