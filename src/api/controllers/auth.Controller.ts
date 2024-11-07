import { Request, Response } from 'express';

/**
 * @desc login
 * @route post /api/user/login
 * @access Public
 */
const login = async (req: Request, res: Response) => {
  const { userName, email, Password } = req.body;
  console.log('user Detail', userName, email, Password);
  res.status(200).json({ message: 'GET request to the login' });
};

/**
 * @desc register
 * @route post /api/user/register
 * @access Public
 */
const register = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'GET request to the register' });
};

export { login, register };
