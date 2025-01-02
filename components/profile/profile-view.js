async function renderProfilePage(res, data) {
    res.render('profile.ejs', {
        user: data,
    });
}

module.exports = { renderProfilePage };
