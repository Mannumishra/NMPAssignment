const passport = require('passport');
const User = require('./Model/UserModel');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Find existing user
                let user = await User.findOne({ email: profile.emails[0].value });

                if (!user) {
                    // Create a new user if none exists
                    user = new User({
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName || '',
                        email: profile.emails[0].value,
                        password: null, // Not needed for Google users
                    });

                    await user.save();
                }

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
