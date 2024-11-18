import User from '@models/user.model';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@utils/jwt.utils';

// Check if the username or email already exists
// const checkIfUserNameExists = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void | Response> => {
//   const { username, email } = req.body;
//   const userNameExists = await User.findOne({ where: { username } });

//   if (userNameExists) {
//     res.statusCode = 409;
//     next(new Error('Username already exists'));
//   }

//   const userEmail = await User.findOne({ where: { email } });
//   if (userEmail) {
//     res.statusCode = 409;
//     next(new Error('Email already exists'));
//   }
// };

const userRegistration = async (
  username: string,
  email: string,
  password: string,
) => {
  const userNameExists = await User.findOne({ where: { username } });

  if (userNameExists) {
    return { message: 'Username already exists', statusCode: 409 };
  }
  const userEmail = await User.findOne({ where: { email } });
  if (userEmail) {
    return { message: 'Email already exists', statusCode: 409 };
  }

  const newUser = await User.create({ username, email, password });

  const accessToken = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);

  newUser.update({ refresh_token: refreshToken });

  return {
    newUser,
    accessToken,
    refreshToken,
    statusCode: 200,
  };
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

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.update({ refresh_token: refreshToken });

  return {
    accessToken,
    refreshToken,
    statusCode: 200,
  };
};

const generateNewAccessToken = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);

  if (!payload || !payload.userId) {
    return {
      message: 'Invalid refresh token, verification failed',
      statusCode: 401,
    };
  }

  const userId = payload.userId;
  const user = await User.findByPk(userId);
  if (!user) {
    return { message: 'User not found', statusCode: 404 };
  }
  if (user.refresh_token !== refreshToken) {
    return {
      message: 'Invalid refresh token, user unauthorize or blocked',
      statusCode: 401,
    };
  }
  const newRefreshToken = generateRefreshToken(user._id);
  await user.update({ refresh_token: newRefreshToken });

  const newAccessToken = generateAccessToken(user._id);
  return {
    newAccessToken,
    newRefreshToken,
    statusCode: 200,
  };
};

export { userRegistration, userAuthentications, generateNewAccessToken };
