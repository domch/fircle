import { useEffect, useState } from 'react';

interface Notification {
  id: number;
  message: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetch('/api/notifications')
      .then((res) => res.json())
      .then(setNotifications)
      .catch(() => setNotifications([]));
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <ul className="space-y-2">
        {notifications.map((n) => (
          <li key={n.id} className="border p-2">
            {n.message}
          </li>
        ))}
      </ul>
      {notifications.length === 0 && <p>No notifications.</p>}
    </main>
  );
}
