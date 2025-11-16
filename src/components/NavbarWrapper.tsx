// components/NavbarWrapper.tsx
'use client'; 

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import Image from "next/image";
import React from 'react';

// Importa los tipos si usas TypeScript, aquí lo dejo como 'any' para simpleza
export default function NavbarWrapper({ children, session }: { children: React.ReactNode, session: any }) {

    return (
        <>
            <nav className="w-full bg-black shadow-sm mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="text-xl font-semibold">
                    MyAppAuth
                </Link>
                <ul className="flex items-center justify-center gap-6 text-sm">
                    <li>
                        <Link href="/dashboard" className="hover:text-gray-600">
                            Dashboard
                        </Link>
                    </li>
                    {session?.user && (
                        <li>
                            <Link href="/profile" className="hover:text-gray-600">
                                Profile
                            </Link>
                        </li>
                    )}
                    {session?.user && (
                        <li>
                            {/* LogoutButton ahora está correctamente anidado en un Client Component */}
                            <LogoutButton />
                        </li>
                    )}
                    {session?.user?.image && (
                        <li>
                            <Image
                                height={100}
                                width={100}
                                src={session?.user?.image}
                                alt="Profile"
                                className="m-10 h-10 rounded-full"
                            />
                        </li>
                    )}
                </ul>
            </nav>
            <main>{children}</main>
        </>
    );
}