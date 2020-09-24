import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { JWT } from '../../config';
import { User } from '../models'

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT.ACCESS_JWT_SECRET
};

interface PayloadJWT {
  id: number,
}

export default new Strategy(options, async (payload:PayloadJWT, done:VerifiedCallback) => {
  const { id } = payload;
  if (!id) {
    return done('Not found id', null);
  }
  const { user, error } = await User.getUserById(id);

  if (error) {
    return done(error);
  }

  done(null, user);
});
