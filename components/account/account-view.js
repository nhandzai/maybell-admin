async function renderAccountPage(res, accounts) {
    res.render('account-list.ejs', {
        accounts: accounts.accounts,
        page: accounts.page,
        pageNumber: accounts.pageNumber
    });
}
async function renderLogInPage(res) {
    res.render('log-in.ejs');
}

module.exports = { renderAccountPage, renderLogInPage };
