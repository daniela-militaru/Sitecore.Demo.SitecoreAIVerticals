import type { NextApiRequest, NextApiResponse } from 'next';
import { handleAuth } from '@auth0/nextjs-auth0';

export default function auth(req: NextApiRequest, res: NextApiResponse) {
  console.log('AUTH0_SECRET present?', Boolean(process.env.AUTH0_SECRET));
  return handleAuth()(req, res);
}
