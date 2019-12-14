exports.login= function (req, res, next) {
    if (req.session.user) {
        res.location("/super/update");
        res.send(302);
    }
    else {
        res.render("super_login");
    }
}

exports.update = function (req, res, next) {
    if (!req.session.user) {
        res.location("/super/login");
        res.send(302);
    }
    else {
        let cient = require("mongodb").MongoClient;
        let db_url = "mongodb://localhost:27017";
        cient.connect(db_url, {useUnifiedTopology: true}, function (err, db) {
            if (err) {
                throw err;
            }

            let database = db.db("entertainer");
            database.collection("super").find({}).toArray(function (err1, data1) {
                if (err1) {
                    throw err1;
                }

                database.collection("works").find({}).toArray(function (err2, data2) {
                    if (err2) {
                        throw err2;
                    }

                    let list = [];
                    for (let i in data2) {
                        list.push({
                            title: data2[i].title,
                            id: data2[i]._id
                        });
                    }

                    res.render("super_update", {
                        title: data1[1].title,
                        subtitle: data1[1].subtitle,
                        list: list
                    });
                })


            });
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
        database.collection("super").find({}).toArray(function (err, data) {
            let pwd = sha256(req.params.pwd);
            if (data[0].password === pwd) {
                req.session.user = "super";
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
    res.location("/super/login");
    res.send(302);
}

exports.write = function (req, res, next) {
    let client = require("mongodb").MongoClient;
    let db_url = "mongodb://localhost:27017";

    client.connect(db_url, { useUnifiedTopology: true }, function (err, db) {
        if (err) {
            throw err;
        }

        let database = db.db("entertainer");
        database.collection("super").find({}).toArray(function (err, data) {
            database.collection("super").updateMany({title: data[1].title, subtitle: data[1].subtitle},
                {$set: {title: req.body["title"], subtitle: req.body["subtitle"]}}, function (err2, docs) {
                    if (err2) {
                        throw err2;
                    }
                });

            let pwd = sha256(req.body["old password"]);
            if (pwd === data[0].password) {
                database.collection("super").updateOne({password: data[0].password},
                    {$set: {password: sha256(req.body["new password"])}}, function (err2, docs) {
                        if (err2) {
                            throw err2;
                        }
                    });
                res.json(JSON.stringify({status: "yes"}));
            }
            else {
                res.json(JSON.stringify({status: "no"}));
            }

            if (!req.body.hasOwnProperty("icon")) {
                uploadfile(req.files.icon.path, "./public/image/icon.png");
            }
            if (!req.body.hasOwnProperty("back")) {
                uploadfile(req.files.back.path, "./public/image/back.png");
            }
            if (!req.body.hasOwnProperty("add")) {
                let sd = require("silly-datetime");
                let ObjectId = require("mongodb").ObjectId;

                let temp = ObjectId();
                database.collection("works").insertOne(
                    {_id: temp, title: req.body["name"], author: req.body["author"], tags: req.body["tags"],time: sd.format(new Date(), "YYYY-MM-DD")},
                    function (err, docs) {
                        if (err) {
                            throw err;
                        }

                        uploadfile(req.files.add.path, "./public/content/" + temp.toString() + ".md");
                    });
            }
            if (req.body["remove total"] > 0) {
                let ObjectId = require("mongodb").ObjectId;
                for (let i = 0; i < req.body["remove total"]; i++) {
                    database.collection("works").removeOne({_id: ObjectId(req.body["remove" + i])}, function (err, docs) {
                        if (err) {
                            throw err;
                        }
                    });
                }
            }
        });
    })
}

function sha256(text) {
    if (text === undefined) {
        return "";
    }

    let crypto = require("crypto");
    let hash = crypto.createHash("sha256");
    hash.update(text);
    return hash.digest("hex");
}

function uploadfile(from, to) {
    let fs = require("fs");
    let input = fs.createReadStream(from);
    let output = fs.createWriteStream(to);

    input.pipe(output);
}
