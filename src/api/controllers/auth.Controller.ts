import { NextFunction, Request, Response } from 'express';
import User from '@models/user.model';
import { checkIfUserNameExists } from '@api/services/user.services';

/**
 * @desc login
 * @route post /api/user/login
 * @access Public
 */
const login = async (req: Request, res: Response) => {
  const { username, email, password } = {
    username: 'tes2',
    email: 'testemail2',
    password: '123',
  };
  console.log('user Detail', username, email, password);

  const newUser = await User.create({ username, email, password });

  res
    .status(200)
    .json({ message: 'Post request to the login', nweUser: newUser });
};

/**
 * @desc register
 * @route post /api/user/register
 * @access Public
 */
const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    res.statusCode = 400;
    next(new Error('Fields cannot be empty'));
  }

  await checkIfUserNameExists(req, res, next);
  const newUser = await User.create({ username, email, password });
  return res
    .status(200)
    .json({ message: 'Post request to the login', nweUser: newUser });
};

export { login, register };
