import type { NextApiRequest, NextApiResponse } from 'next';
import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

export default handleAuth({
  // Force credential prompt
  login: async (req: NextApiRequest, res: NextApiResponse) => {
    return handleLogin(req, res, {
      authorizationParams: {
        prompt: 'login',
      },
    });
  },

  // (Optional) make logout also clear the Auth0 session
  logout: async (req: NextApiRequest, res: NextApiResponse) => {
    return handleLogout(req, res, {
      // `returnTo` is optional; your app URL is fine
      returnTo: '/',
    });
  },
});
