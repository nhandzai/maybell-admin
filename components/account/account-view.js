async function renderAccountPage(res, accounts) {
    res.render('account-list.ejs', {
        accounts: accounts.accounts,
        page: accounts.page,
        pageNumber: accounts.pageNumber
    });
}

module.exports = { renderAccountPage };
