// app/api/register/route.ts

import * as bcrypt from "bcryptjs";
import { NextResponse } from 'next/server';
import { usersInMemory } from '@/lib/db-in-memory'; // Importar el arreglo
import { DbUser } from '@/app/api/auth/[...nextauth]/route'; // Importar la interfaz

const SALT_ROUNDS = 10;

// 🛑 REEMPLAZAR la función saveUserToDb:
const saveUserToDb = async (email: string, passwordHash: string, name: string) => {
    
    const newUser: DbUser = {
        // En una DB real, esto lo generaría la DB
        id: (usersInMemory.length + 1).toString(), 
        email: email,
        password: passwordHash,
        name: name,
        loginAttempts: 0,
        lockUntil: null,
    };

    // Guarda el nuevo usuario en el arreglo en memoria
    usersInMemory.push(newUser);
    console.log("Usuarios en memoria:", usersInMemory);
    
    return newUser;
};

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Faltan credenciales" }, { status: 400 });
        }
        
        // **OPCIONAL:** Verificar si el usuario ya existe antes de registrar
        // if (findUserByEmailInMemory(email)) {
        //     return NextResponse.json({ message: "El usuario ya existe" }, { status: 409 });
        // }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await saveUserToDb(email, hashedPassword, name || 'Nuevo Usuario');

        return NextResponse.json({ message: "Usuario registrado exitosamente" }, { status: 201 });

    } catch (error) {
        console.error("Error en el registro:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}