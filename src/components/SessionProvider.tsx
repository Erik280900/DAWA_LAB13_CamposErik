'use client'; 

import { SessionProvider } from "next-auth/react"

export default function Provider({
    children,
    session // Recibe la sesión del servidor
}: {
    children: React.ReactNode;
    session: any; // Ajusta el tipo de sesión si estás usando TypeScript
}) {
    return (
        // Se pasa la sesión aquí.
        <SessionProvider session={session}> 
            {children}
        </SessionProvider>    
    )
}