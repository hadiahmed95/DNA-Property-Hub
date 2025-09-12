import 'server-only'
import { cookies } from 'next/headers'
 
export async function createSession(key: string, data: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  
  const cookieStore = await cookies()
  cookieStore.set(key, data, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function updateSession(key: string, data: string) {
  const session = (await cookies()).get(key)?.value

  if (!session || !data) {
    return null
  }
 
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 
  const cookieStore = await cookies()
  cookieStore.set(key, data, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession(key: string) {
  const cookieStore = await cookies()
  return cookieStore.get(key)?.value
}

export async function deleteSession(key: string) {
  const cookieStore = await cookies()
  cookieStore.delete(key)
}