import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';

interface Doc {
  version: string;
  content: string;
}

export default function GtcPage() {
  const [doc, setDoc] = useState<Doc | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/gtc')
      .then((res) => res.json())
      .then(setDoc)
      .catch(() => {});
  }, []);

  const accept = async () => {
    await fetch('/api/users/1/accept-gtc', { method: 'POST' });
    router.push('/dashboard');
  };

  if (!doc) return <main className="p-4">Loading...</main>;

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Terms and Conditions</h1>
      <ReactMarkdown className="prose">{doc.content}</ReactMarkdown>
      <button className="px-4 py-2 bg-blue-500 text-white" onClick={accept}>
        Accept
      </button>
    </main>
  );
}
