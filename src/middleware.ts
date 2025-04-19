import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Check if the path starts with /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If not logged in, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Fetch user role from database
    const res = await fetch(`${request.nextUrl.origin}/api/users/me`, {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    })
    
    if (!res.ok) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    const userData = await res.json()
    
    // If not admin, redirect to dashboard
    if (userData.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
