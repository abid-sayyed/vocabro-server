import { NextFunction, Request, Response } from 'express';
import {
  userRegistration,
  userAuthentications,
  generateNewAccessToken,
} from '@api/services/auth.service';
/**
 * @desc register
 * @route post /api/user/register
 * @access Public
 */
const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.statusCode = 400;
    next(new Error('Fields cannot be empty'));
    return;
  }

  const newUser = await userRegistration(username, email, password);

  if (newUser.statusCode !== 200) {
    res.statusCode = newUser.statusCode;
    next(new Error(newUser.message));
    return;
  }

  res.cookie('accessToken', newUser.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // secure cookies (https) in production
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // token expiration (15 mins here)
  });

  res.cookie('refreshToken', newUser.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week here / 7 days
  });

  res.status(200).json({
    message: 'User registered successfully',
  });
};

/**
 * @desc login
 * @route post /api/user/login
 * @access Public
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  if (!password) {
    res.statusCode = 401;
    next(new Error('Password is required'));
    return;
  }

  if (!email && !username) {
    res.statusCode = 404;
    next(new Error('Either email or username must be provided'));
    return;
  }

  const result = await userAuthentications(username, email, password);
  if (result.statusCode !== 200) {
    res.statusCode = result.statusCode;
    next(new Error(result.message));
    return;
  }

  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // secure cookies (https) in production
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // token expiration (15 mins here)
  });

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week here / 7 days
  });

  res.status(200).json({
    message: 'login successful',
  });
};

/**
 * @desc refreshToken
 * @route post /api/refresh-token
 * @access private
 */

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req?.cookies?.refreshToken || null;

  if (!refreshToken) {
    res.statusCode = 400;
    next(new Error('Refresh token is empty'));
    return;
  }

  const newToken = await generateNewAccessToken(refreshToken);
  if (newToken.statusCode !== 200) {
    res.statusCode = newToken.statusCode;
    next(new Error(newToken.message));
    return;
  }

  const { newAccessToken, newRefreshToken } = newToken;

  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // secure cookies (https) in production
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // token expiration (15 mins here)
  });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week here / 7 days
  });

  res.status(200).json({
    status: 200,
    message: 'success',
  });
};

/**
 * @desc logout
 * @route post /api/logout
 * @access private
 */

const logout = async (req: Request, res: Response) => {
  // Explicitly set the cookies with empty values and immediate expiration
  res.cookie('accessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0), // Expire immediately
  });

  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
  });

  // Also use res.clearCookie for additional compatibility
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  // Respond to the client
  res.status(200).json({
    status: 200,
    message: 'Logout successful',
  });
};

export { register, login, refreshToken, logout };
