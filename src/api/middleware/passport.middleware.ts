// middlewares/passport.middleware.ts
import { Request } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
// import User from '@models/user.model';

const cookieExtractor = (req: Request): string | null => {
  return req?.cookies?.accessToken || null; // Make sure to use the correct cookie name
};

const options: StrategyOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET as string,
};

const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
  return done(null, payload);
});

passport.use(jwtStrategy);

export default passport;
