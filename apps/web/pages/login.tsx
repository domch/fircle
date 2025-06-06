import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();

  const login = async (provider: string) => {
    try {
      await fetch(`/api/auth/${provider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'dummy-token' }),
      });
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="p-4 flex flex-col items-center space-y-2">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <button
        className="px-4 py-2 bg-blue-500 text-white"
        onClick={() => login('google')}
      >
        Login with Google
      </button>
      <button
        className="px-4 py-2 bg-green-600 text-white"
        onClick={() => login('microsoft')}
      >
        Login with Microsoft
      </button>
    </main>
  );
}
