const { renderProfilePage } = require('./profile-view');
const { getAccountDetailById, changeProfileById } = require('./profile-model');

async function getProfilePage(req, res, next) {
    try {
        const data = await getAccountDetailById(req.user.id);
        await renderProfilePage(res, data.account)
    } catch (error) {
        next(error);
    }
}

async function changeProfile(req, res, next) {
    try {
        const accountId = req.body.id;
        if (!accountId) {
            throw new Error("Account ID is required.");
        }

        const updatedAccount = await changeProfileById(req, accountId);
        res.json(updatedAccount);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}

module.exports = { getProfilePage, changeProfile };