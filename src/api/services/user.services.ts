import { Request, Response, NextFunction } from 'express';
import User from '@models/user.model'; // Adjust the import based on your actual file path

const checkIfFieldIsEmpty = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.statusCode = 400;
    next(new Error('Fields cannot be empty'));
  }
};

// Check if the username or email already exists
const checkIfUserNameExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { username, email } = req.body;
  const userNameExists = await User.findOne({ where: { username } });

  if (userNameExists) {
    res.statusCode = 409;
    next(new Error('Username already exists'));
  }

  const userEmail = await User.findOne({ where: { email } });
  if (userEmail) {
    res.statusCode = 409;
    next(new Error('Email already exists'));
  }
};

export { checkIfFieldIsEmpty, checkIfUserNameExists };
