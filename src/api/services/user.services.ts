import { Request, Response, NextFunction } from 'express';
import User from '@models/user.model'; // Adjust the import based on your actual file path

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

export { checkIfUserNameExists };
