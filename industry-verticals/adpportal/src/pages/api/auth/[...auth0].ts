import { handleAuth } from '@auth0/nextjs-auth0';

export default function auth(req: any, res: any) {
  console.log('AUTH0_SECRET present?', Boolean(process.env.AUTH0_SECRET));
  return handleAuth()(req, res);
}
