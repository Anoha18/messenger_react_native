import { VerifiedCallback } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { User } from '../models';

const opts = { usernameField: 'login', passwordField: 'password' }

export default new Strategy(opts, async(login: string, password: string, done:VerifiedCallback) => {
  const { user, error } = await User.authUser(login, password);

  if (error) { return done(error) }
  if (!user) { return done(null, null, 'Логин иили пароль неверный') }

  done(null, user);
});
