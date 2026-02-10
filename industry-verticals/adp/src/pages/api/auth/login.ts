import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

// Mock user database
const users = {
  demo1: {
    username: 'demo1',
    password: 'demo1',
    name: 'Demo User 1',
    company: 'Demo Company 1',
  },
  demo2: {
    username: 'demo2',
    password: 'demo2',
    name: 'Demo User 2',
    company: 'Demo Company 2',
  },
  'christian.radermacher@sitecore.com': {
    username: 'christian.radermacher@sitecore.com',
    password: 'demo',
    name: 'Christian Radermacher',
    company: 'Sitecore',
  },
  'johan.becue@sitecore.com': {
    username: 'johan.becue@sitecore.com',
    password: 'demo',
    name: 'Johan Becue',
    company: 'Sitecore',
  },
  'sarah.oreilly@sitecore.com': {
    username: 'sarah.oreilly@sitecore.com',
    password: 'demo',
    name: "Sarah O'Reilly",
    company: 'Sitecore',
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    console.log('[v0] Login attempt:', { username });

    const user = users[username as keyof typeof users];

    if (!user || user.password !== password) {
      console.log('[v0] Invalid credentials');
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const cookie = serialize(
      'auth-token',
      JSON.stringify({
        username: user.username,
        name: user.name,
        company: user.company,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      }
    );

    res.setHeader('Set-Cookie', cookie);
    console.log('[v0] Login successful, cookie set');

    return res.status(200).json({
      success: true,
      user: {
        username: user.username,
        name: user.name,
        company: user.company,
      },
    });
  } catch (error) {
    console.error('[v0] Login error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
