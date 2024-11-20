import { Request, Response, NextFunction } from 'express';
import { getUserProfile } from '@api/services/userDetail.service';

type UserToken = {
  userId: string;
  iat: number;
  exp: number;
};

/**
 * @desc Get user profile
 * @route GET /api/user-detail/Profile
 * @access Private
 */
export const userProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userIdbody = req.user as UserToken;
  const userProfile = await getUserProfile(userIdbody.userId);

  if (userProfile.statusCode !== 200) {
    res.statusCode = userProfile.statusCode;
    next(new Error(userProfile.message));
    return;
  }

  res.status(200).json(userProfile);
};
