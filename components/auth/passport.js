const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { prisma } = require('../../config/config');

module.exports = (passport) => {

    passport.use(
        'local',
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await prisma.users.findUnique({
                    where: { email },
                });
                if (!user) {
                    return done(null, false, { message: 'Invalid email or password.' });
                }

             
                if (!user.isAdmin) {
                    return done(null, false, { message: 'You are not authorized to access this platform.' });
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return done(null, false, { message: 'Invalid email or password.' });
                }
                

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );

    // Serialize user for session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user from session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await prisma.users.findUnique({
                where: { id },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    isAdmin: true,
                },
            });
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};
