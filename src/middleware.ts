import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isProtectedPath = path.startsWith('/profile') || path.startsWith('/stocks') || path.startsWith('/reset-password') ;
    
    const userSession = request.cookies.get('next-auth.session-token');

    if (isProtectedPath && !userSession) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/profile/:path*',
        '/stocks/:path*',
        '/reset-password/:path*'
    ]
};