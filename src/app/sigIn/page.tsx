'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaGithub } from 'react-icons/fa'; 
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error); 
    } else if (result?.ok) {
      router.push('/dashboard');
    }
  };
  
  const handleSocialSignIn = async (providerId: string) => {
    await signIn(providerId, {
      callbackUrl: '/dashboard',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
          Iniciar Sesión
        </h1>

        {error && <p className="text-red-500 mb-4 text-center border border-red-500 p-2 rounded">{error}</p>}
        
        {/* Formulario de Credenciales */}
        <form onSubmit={handleCredentialsSignIn} className="space-y-4 mb-6">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded text-gray-900"
                required
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded text-gray-900"
                required
            />
            <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
            >
                Iniciar Sesión
            </button>
        </form>

        <p className="text-center my-4">o continua con</p>
        
        {/* Botones Sociales */}
        <div className="space-y-3">
            <button
                onClick={() => handleSocialSignIn('google')}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
                <FaGoogle />
                Continue with Google
            </button>
            <button
                onClick={() => handleSocialSignIn('github')}
                className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition flex items-center justify-center gap-2"
            >
                <FaGithub />
                Continue with GitHub
            </button>
        </div>

        <p className="mt-4 text-center text-sm">
            ¿No tienes cuenta? <Link href="/register" className="text-indigo-600 hover:underline">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}