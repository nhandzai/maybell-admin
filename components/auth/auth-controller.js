const passport = require('passport');
const { prisma } = require('../../config/config');

const authenticateUser = async (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        console.log("user", user)
        if (err) {
            return res.status(500).json({ message: 'Server error during authentication', error: err });
        }
       
        if (!user) {
            return res.status(400).json({ message: info.message });
        }
        req.logIn(user, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'Login failed.' });
            }

            const userId = user.id;
            const userDetails = await prisma.users.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    isAdmin: true,
                }
            });

            return res.status(200).json({
                message: 'Login successful',
                user: userDetails, 
            });
        });
    })(req, res, next);
};

module.exports = { authenticateUser };
