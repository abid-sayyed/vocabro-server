import { NextFunction, Request, Response } from 'express';
import User from '@models/user.model';
import {
  checkIfUserNameExists,
  checkIfFieldIsEmpty,
} from '@api/services/user.services';

/**
 * @desc login
 * @route post /api/user/login
 * @access Public
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
  await checkIfFieldIsEmpty(req, res, next);

  const { username, email, password } = req.body;

  const user = await User.findOne({
    where: {
      [email ? 'email' : 'username']: email || username,
    },
  });

  if (!user) {
    res.statusCode = 404;
    next(new Error('user not found'));
    return;
  }

  const isPasswordValid = await user.validatePassword(user, password);
  if (!isPasswordValid) {
    res.statusCode = 401;
    next(new Error('Invalid password'));
    return;
  }

  // // Generate tokens
  // const accessToken = generateAccessToken(user._id);
  // const refreshToken = generateRefreshToken(user._id);

  res.status(200).json({
    message: 'Post request to the login: user found',
    username: user.username,
    email: user.email,
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
