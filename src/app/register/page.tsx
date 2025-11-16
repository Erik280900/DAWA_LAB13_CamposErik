'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
        });

        if (response.ok) {
            alert('Registro exitoso. ¡Ahora inicia sesión!');
            router.push('/sigIn'); 
        } else {
            const data = await response.json();
            setError(data.message || 'Error al registrar usuario.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center text-black">Registrarse</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-black">Nombre</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border p-2 rounded text-gray-900"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-black">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border p-2 rounded text-gray-900"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-black">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border p-2 rounded text-gray-900"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Crear Cuenta
                    </button>
                </form>

                <p className="mt-4 text-center text-sm">
                    ¿Ya tienes cuenta? <Link href="/sigIn" className="text-blue-600 hover:underline">Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
}