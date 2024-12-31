const { renderAccountPage } = require('./account-view');
const { getAccounts } = require('./account-model');

async function getAccountPage(req, res, next) {
  try {
    const accounts = await getAccounts(req);
    await renderAccountPage(res, accounts);
  } catch (error) {
    next(error);
  }
}

async function getAccountPageAPI(req, res, next) {
  try {
    const accounts = await getAccounts(req);
    res.json(accounts)
  } catch (error) {
    next(error);
  }
}

module.exports = { getAccountPage,getAccountPageAPI };
