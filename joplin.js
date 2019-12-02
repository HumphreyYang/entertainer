exports.login= function (req, res, next) {
    res.render("joplin_login");
}

exports.update = function (req, res, next) {
    res.render("joplin_update", {
        list: ["article1",
            "article2",
            "article3",
            "article4",
            "article5"]
    });
}
