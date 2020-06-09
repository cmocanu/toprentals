import { Request } from 'express';

import { verifyToken } from 'utils/authToken';
import { catchErrors, InvalidTokenError } from 'errors';
import { User } from 'entities';
import { isTokenInBlacklist } from 'state/token_blacklist';

export const authenticateUser = catchErrors(async (req, _res, next) => {
  const token = getAuthTokenFromRequest(req);
  if (!token) {
    throw new InvalidTokenError('Authentication token not found.');
  }
  if (isTokenInBlacklist(token)) {
    throw new InvalidTokenError('Invalid token.');
  }
  const email = verifyToken(token).email;
  if (!email) {
    throw new InvalidTokenError('Authentication token is invalid.');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new InvalidTokenError('Authentication token is invalid: User not found.');
  }
  req.currentUser = user;
  next();
});

export const getAuthTokenFromRequest = (req: Request): string | null => {
  const header = req.get('Authorization') || '';
  const [bearer, token] = header.split(' ');
  return bearer === 'Bearer' && token ? token : null;
};
