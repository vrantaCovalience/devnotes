import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const key = new TextEncoder().encode(process.env.JWT_SECRET)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })
  return payload
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return null
  return await decrypt(session)
}

export async function createSession(userId: string, username: string) {
  const session = await encrypt({ userId, username, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) })
  const cookieStore = await cookies()
  
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    sameSite: 'lax',
    path: '/',
  })
}

/**
 * Deletes the 'session' cookie from the cookie store, effectively ending the user's session.
 *
 * @returns {Promise<void>} A promise that resolves when the session cookie has been deleted.
 */
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

/**
 * Verifies the current user session and returns user information if authenticated.
 *
 * @returns A promise that resolves to an object containing the user's ID and username if the session is valid,
 *          or `null` if the session is invalid or the user is not authenticated.
 */
export async function verifySession() {
  const session = await getSession()
  if (!session?.userId) {
    return null
  }
  return { userId: session.userId, username: session.username }
}