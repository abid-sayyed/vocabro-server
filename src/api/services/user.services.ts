import { Request, Response, NextFunction } from 'express';
import User from '@models/user.model';
import { generateAccessToken, generateRefreshToken } from '@utils/jwt.utils';

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

const userAuthentications = async (
  userName: string,
  email: string,
  password: string,
) => {
  const user = await User.findOne({
    where: {
      [email ? 'email' : 'username']: email || userName,
    },
  });

  if (!user) {
    return { message: 'user not found', statusCode: 404 };
  }

  const isPasswordValid = await user.validatePassword(user, password);
  if (!isPasswordValid) {
    return { message: 'Invalid password', statusCode: 401 };
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.update({ refresh_token: refreshToken });

  return {
    accessToken,
    refreshToken,
    statusCode: 200,
  };
};

export { checkIfFieldIsEmpty, checkIfUserNameExists, userAuthentications };
