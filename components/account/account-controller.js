const { renderAccountPage } = require('./account-view');
const { getAccounts, getAccountById } = require('./account-model');

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

async function banAccount(req, res, next) {
  try {
    const accountId = req.body.id;
    if (!accountId) {
        throw new Error("Account ID is required.");
    }

    const data = await getAccountById(accountId);
    res.json(data);
  } catch (error) {
    console.error('Error in banAccount controller:', error);
    res.status(500).json({ error: error.message }); 
  }
}


module.exports = { getAccountPage, getAccountPageAPI, banAccount };
