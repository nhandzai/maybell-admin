const { renderAccountPage } = require('./account-view');
const { getAccounts, banAccountById, getAccountDetailById } = require('./account-model');

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
    res.status(500).json({ error: error.message });
    next(error);
  }
}

async function banAccount(req, res, next) {
  try {
    const accountId = req.body.id;
    if (!accountId) {
      throw new Error("Account ID is required.");
    }

    const data = await banAccountById(accountId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
}

async function getAccountDetail(req, res, next) {
  try {
    const accountId = req.query.id;
    if (!accountId) {
      throw new Error("Account ID is required.");
    }

    const data = await getAccountDetailById(accountId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
}


module.exports = { getAccountPage, getAccountPageAPI, banAccount, getAccountDetail };
