'use server';

import { cookies } from 'next/headers';

export type UserSegment = 'employer' | 'hr-rep' | 'employee' | 'partner' | 'admin' | 'customer';

interface MockUser {
  username: string;
  password: string;
  name: string;
  company: string;
  segment: UserSegment;
}

// Mock user database
const users: MockUser[] = [
  {
    username: 'demo1',
    password: 'demo1',
    name: 'Sarah Johnson',
    company: 'Tech Solutions Inc',
    segment: 'employer',
  },
  {
    username: 'demo2',
    password: 'demo2',
    name: 'Michael Chen',
    company: 'Digital Partners LLC',
    segment: 'employee',
  },
  {
    username: 'christian.radermacher@sitecore.com',
    password: 'demo',
    name: 'Christian Radermacher',
    company: 'Individual',
    segment: 'customer',
  },
  {
    username: 'johan.becue@sitecore.com',
    password: 'demo',
    name: "Sarah O'Reilly",
    company: 'Sitecore',
    segment: 'hr-rep',
  },
  {
    username: 'admin',
    password: 'admin',
    name: 'ADP Administrator',
    company: 'ADP Inc.',
    segment: 'admin',
  },
];

export async function login(username: string, password: string) {
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    const cookieStore = await cookies();

    // Set auth-user cookie with user info
    cookieStore.set(
      'auth-user',
      JSON.stringify({
        username: user.username,
        name: user.name,
        company: user.company,
        segment: user.segment,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      }
    );

    // Set segment cookie (non-httpOnly so client-side can read it for personalisation)
    cookieStore.set('user-segment', user.segment, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      user: {
        username: user.username,
        name: user.name,
        company: user.company,
        segment: user.segment,
      },
    };
  }

  return { success: false, error: 'Invalid credentials' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-user');
  cookieStore.delete('user-segment');
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('auth-user');

  if (!userCookie) {
    return null;
  }

  try {
    return JSON.parse(userCookie.value) as {
      username: string;
      name: string;
      company: string;
      segment: UserSegment;
    };
  } catch {
    return null;
  }
}
