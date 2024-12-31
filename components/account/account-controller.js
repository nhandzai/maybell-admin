const { renderAccountPage } = require('./account-view');
const { getAccounts } = require('./account-model');

async function getAccountPage(req, res, next) {
  try {
    const accounts = await getAccounts(req);
    if (!req.query.page)
      await renderAccountPage(res, accounts);
    else
      res.json(accounts)
  } catch (error) {
    next(error);
  }
}

module.exports = { getAccountPage };
