import { DbUser } from '@/app/api/auth/[...nextauth]/route'; // Importa la interfaz
// Este arreglo simulará tu tabla de usuarios
export const usersInMemory: DbUser[] = [];

// Función para encontrar un usuario por email
export const findUserByEmailInMemory = (email: string): DbUser | undefined => {
    return usersInMemory.find(user => user.email === email);
};