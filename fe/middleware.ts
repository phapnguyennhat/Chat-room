import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const privatePath = [
    '/dashboard',
    '/friend',
    '/message'
    
];
const authPath = ['/login', '/register', '/forget'];
const publicPath = [];

export async function middleware(request: NextRequest) {
    const isLogin = request.cookies.has('Refresh');
    const currentPath = request.nextUrl.pathname;

    const Authentication = request.cookies.get('Authentication');

    if (!Authentication && isLogin) {
        const Refresh = request.cookies.get('Refresh');
        const response = await fetch(
            `${process.env.BACKEND_URL}/auth/refresh`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Cookie: `${Refresh?.name}=${Refresh?.value}`,
                },
            },
        );

        if (response.ok) {
            return NextResponse.redirect(new URL(currentPath, request.url), {
                headers: {
                    'Set-Cookie': response.headers.get('set-cookie') as string,
                },
            });
        } else {
            const cookieStore = await cookies();
            cookieStore.delete('Refresh');
            return NextResponse.redirect(new URL('/login', request.url), {});
        }
    }

    if (privatePath.some((path) => currentPath.startsWith(path)) && !isLogin) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    if (authPath.some((path) => currentPath.startsWith(path)) && isLogin) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    const response = NextResponse.next();
    return response;
}

export const config = {
    // matcher: [
    //     /*
    //      * Match all request paths except for the ones starting with:
    //      * - api (API routes)
    //      * - _next/static (static files)
    //      * - _next/image (image optimization files)
    //      * - favicon.ico, sitemap.xml, robots.txt (metadata files)
    //      */
    //     '/profile',
    //     '/login',
    //     '/',
    //     '/register',
    //     '/product'
    // ],
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
