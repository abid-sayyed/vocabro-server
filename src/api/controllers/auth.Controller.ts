import { NextFunction, Request, Response } from 'express';
import {
  userRegistration,
  userAuthentications,
  generateNewAccessToken,
} from '@root/src/api/services/user.service';

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
  res.status(200).json({
    message: 'Post request to the register: user created',
    newUser,
  });
};

/**
 * @desc login
 * @route post /api/user/login
 * @access Public
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.statusCode = 400;
    next(new Error('Fields cannot be empty'));
    return;
  }

  const result = await userAuthentications(username, email, password);
  if (result.statusCode !== 200) {
    res.statusCode = result.statusCode;
    next(new Error(result.message));
  }

  const { accessToken, refreshToken } = result;
  res.status(200).json({
    message: 'Post request to the login: user found',
    accessToken,
    refreshToken,
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
  const { refreshToken } = req.body;

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
  res.status(200).json({
    message: 'Post request to the login: user found',
    newAccessToken,
    newRefreshToken,
  });
};

export { register, login, refreshToken };
