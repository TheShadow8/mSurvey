import { serializeUser, deserializeUser, use } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { model } from 'mongoose';
import { googleClientID, googleClientSecret } from '../config/keys';

const User = model('users');

serializeUser((user, done) => {
  done(null, user.id);
});

deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

use(
  new GoogleStrategy(
    {
      clientID: googleClientID,
      clientSecret: googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },

    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleID: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }
      const user = await new User({ googleID: profile.id }).save();
      done(null, user);
    },
  ),
);
