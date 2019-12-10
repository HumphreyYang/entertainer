exports.login= function (req, res, next) {
    if (req.session.user) {
        res.location("/joplin/update");
        res.send(302);
    }
    else {
        res.render("joplin_login");
    }
}

exports.update = function (req, res, next) {
    if (!req.session.user) {
        res.location("/joplin/login");
        res.send(302);
    }
    else {

        res.render("joplin_update", {
            list: ["article1",
                "article2",
                "article3",
                "article4",
                "article5"]
        });
    }
}

exports.visit = function (req, res, next) {
    let client = require("mongodb").MongoClient;
    let db_url = "mongodb://localhost:27017";
    client.connect(db_url, { useUnifiedTopology: true }, function (err, db) {
        if (err) {
            throw err;
        }

        let database = db.db("entertainer");
        let std = database.collection("joplin").find({}).toArray(function (err, data) {
            let crypto = require("crypto");
            let hash = crypto.createHash("sha256");
            hash.update(req.params.pwd);
            let pwd = hash.digest("hex");
            if (data[0].password === pwd) {
                req.session.user = "joplin";
                res.json(JSON.stringify({status: "yes"}));
            }
            else {
                res.json(JSON.stringify({status: "no"}));
            }

            db.close();
        });
    });
}

exports.leave = function (req, res, next) {
    req.session.user = null;
    req.session.error = null;
    res.location("/joplin/login");
    res.send(302);
}
