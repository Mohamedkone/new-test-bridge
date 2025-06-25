import { ENV } from '../utils/constants';

export const auth0Config = {
  domain: ENV.AUTH0_DOMAIN,
  clientId: ENV.AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: ENV.AUTH0_AUDIENCE,
    scope: 'openid profile email',
  },
  useRefreshTokens: true,
  cacheLocation: 'localstorage' as const,
};

export default auth0Config;