async function renderAccountPage(res, accounts) {
  res.render('account-list.ejs', {
    accounts: accounts,
  });
}

module.exports = { renderAccountPage };
