'use server';

import { cookies } from 'next/headers';

// Mock user database
const users = [
  { username: 'demo1', password: 'demo1', name: 'Sarah Johnson', company: 'Tech Solutions Inc' },
  { username: 'demo2', password: 'demo2', name: 'Michael Chen', company: 'Digital Partners LLC' },
  {
    username: 'partner@lenovo.com',
    password: 'partner123',
    name: 'John Partner',
    company: 'Tech Solutions Inc.',
  },
  {
    username: 'sarah.oreilly@sitecore.com',
    password: 'demo',
    name: "Sarah O'Reilly",
    company: 'Sitecore',
  },
];

export async function login(username: string, password: string) {
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    const cookieStore = await cookies();
    cookieStore.set(
      'auth-user',
      JSON.stringify({ username: user.username, name: user.name, company: user.company }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      }
    );
    return {
      success: true,
      user: { username: user.username, name: user.name, company: user.company },
    };
  }

  return { success: false, error: 'Invalid credentials' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-user');
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('auth-user');

  if (!userCookie) {
    return null;
  }

  try {
    return JSON.parse(userCookie.value);
  } catch {
    return null;
  }
}
