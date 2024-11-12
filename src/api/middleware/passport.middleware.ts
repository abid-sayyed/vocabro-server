// middlewares/passport.middleware.ts
import passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';
// import User from '@models/user.model';

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
  return done(null, payload);
});

passport.use(jwtStrategy);

export default passport;
