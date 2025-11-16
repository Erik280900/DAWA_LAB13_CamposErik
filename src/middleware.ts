import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de Next.js.
 * Debe ser una función exportada por defecto.
 * * Actualmente, esta función solo permite que todas las peticiones
 * sigan su curso, solucionando el error de compilación.
 */
export default function middleware(request: NextRequest) {
  // Permite que la solicitud continúe su camino.
  return NextResponse.next();
}

// Configuración opcional: Define las rutas donde se ejecutará el middleware.
export const config = {
  /*
   * El matcher excluye rutas internas de Next.js (como API, static, etc.)
   * Esto es vital para el rendimiento y evitar bucles de redirección.
   */
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};