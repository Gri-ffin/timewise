import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import { NextResponse, NextRequest } from 'next/server'

import { env } from '~/env.mjs'

export { default } from 'next-auth/middleware'

export const config = { matcher: ['/dashboard/:path*'] }

export async function middleware(request: NextRequest & NextApiRequest) {
  const session = await getSession({ req: request })
  if (!session && env.NEXTAUTH_URL) {
    return NextResponse.redirect(env.NEXTAUTH_URL)
  }
} 
