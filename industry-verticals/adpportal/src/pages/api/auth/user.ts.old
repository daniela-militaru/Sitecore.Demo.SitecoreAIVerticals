import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[v0] Request cookies:', req.headers.cookie);
    const cookies = parse(req.headers.cookie || '');
    const authToken = cookies['auth-token'];

    console.log('[v0] Auth token:', authToken);

    if (!authToken) {
      console.log('[v0] No auth token found, returning null user');
      return res.status(200).json({ user: null });
    }

    const user = JSON.parse(authToken);
    console.log('[v0] Returning user:', user);
    return res.status(200).json({ user });
  } catch (error) {
    console.error('[v0] Get user error:', error);
    return res.status(200).json({ user: null });
  }
}
