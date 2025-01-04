function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/log-in');
}

module.exports = { isAuthenticated };
