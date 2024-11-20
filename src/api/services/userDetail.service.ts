import User from '@models/user.model';

export const getUserProfile = async (userId: string) => {
  const user = await User.findByPk(userId);
  if (!user) {
    return { message: 'User not found', statusCode: 404 };
  }

  const { username, email } = user;

  return {
    username,
    email,
    statusCode: 200,
  };
};
