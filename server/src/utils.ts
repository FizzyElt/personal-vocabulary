import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export function getTokenPayload(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
}

export function getUserId(req: Request, authToken?: string) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token found');
      }

      const { userId } = getTokenPayload(token);

      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }
  throw new Error('Not authentication');
}
