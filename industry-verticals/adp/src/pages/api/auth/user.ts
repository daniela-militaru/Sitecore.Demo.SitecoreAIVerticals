import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const cookies = parse(req.headers.cookie || '');
    const userCookie = cookies['auth-user'];

    if (!userCookie) {
      return res.status(200).json({ user: null });
    }

    const user = JSON.parse(userCookie);
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error getting user:', error);
    return res.status(200).json({ user: null });
  }
}
