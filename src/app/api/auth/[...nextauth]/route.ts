import NextAuth, { User, AuthOptions, Session as NextAuthSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs"; 
import { findUserByEmailInMemory } from "@/lib/db-in-memory";
import { JWT } from "next-auth/jwt"; 
import { Session } from "next-auth";

// 🛑 1. INTERFAZ DE BASE DE DATOS (Necesita 'password')
export interface DbUser {
    id: string; 
    email: string;
    password: string; // Contraseña cifrada
    name?: string;
    loginAttempts?: number; 
    lockUntil?: Date | null; 
}

// 🛑 2. INTERFAZ DE AUTENTICACIÓN (Segura, se pasa al JWT/Session)
export interface AuthUser extends User {
    id: string; 
    email: string;
    name?: string;
}

// 🛑 3. FUNCIÓN PLACEHOLDER DE BÚSQUEDA
const findUserByEmail = async (email: string): Promise<DbUser | null> => {
    // Busca en el arreglo en memoria
    const user = findUserByEmailInMemory(email);
    
    return user || null;
};

export const authOptions: AuthOptions = { // Tipado opcional para mayor seguridad
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await findUserByEmail(credentials.email);

                if (!user) {
                    throw new Error("Credenciales inválidas o usuario no encontrado.");
                }

                if (user.lockUntil && user.lockUntil > new Date()) {
                    throw new Error("Tu cuenta está temporalmente bloqueada.");
                }

                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    user.password 
                );

                if (passwordMatch) {
                    // Retornamos el objeto AuthUser (sin password)
                    return { 
                        id: user.id, 
                        name: user.name, 
                        email: user.email 
                    } as AuthUser; 
                } else {
                    throw new Error("Credenciales inválidas.");
                }
            }
        })
    ],
    pages: {
        signIn: '/sigIn', 
    },
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        // 🛑 FIX: 'trigger' ahora es opcional (trigger?) y usa el tipo de unión de NextAuth.
        async jwt({ token, user, trigger } : { 
            token: JWT, 
            user: AuthUser | User | undefined, 
            trigger?: 'signIn' | 'signUp' | 'update' | undefined 
        }) {
            if (user) {
                // El casting a any es la forma de "extender" temporalmente el tipo JWT/Session
                (token as any).id = user.id; 
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        
        async session({ session, token } : { session: Session, token: JWT }) {
            // Se asume que token.id existe porque fue agregado en el callback jwt
            if ((token as any).id) {
                (session.user as any).id = (token as any).id; 
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };