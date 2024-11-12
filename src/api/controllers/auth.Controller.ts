import { NextFunction, Request, Response } from 'express';
import User from '@models/user.model';
import {
  checkIfUserNameExists,
  checkIfFieldIsEmpty,
  userAuthentications,
} from '@api/services/user.services';

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
 * @desc register
 * @route post /api/user/register
 * @access Public
 */
const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  await checkIfFieldIsEmpty(req, res, next);
  await checkIfUserNameExists(req, res, next);

  const newUser = await User.create({ username, email, password });
  res
    .status(200)
    .json({ message: 'Post request to the login', nweUser: newUser });
};

export { login, register };
