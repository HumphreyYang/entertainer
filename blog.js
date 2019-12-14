exports.blog = function (req, res, next) {
    let client = require("mongodb").MongoClient;
    let ObjectId = require("mongodb").ObjectId;
    let markdowner = require("markdown-it");
    let fs = require("fs");
    let db_url = "mongodb://localhost:27017";

    client.connect(db_url, { useUnifiedTopology: true }, function (err, db) {
        if (err) {
            throw err;
        }

        let database = db.db("entertainer");
        database.collection("works").find({_id: ObjectId(req.params.id)}).toArray(function (err, data) {
            if (err) {
                throw err;
            }

            let md = new markdowner({
                html: true,
                prefix: "code-"
            });

            fs.readFile("./public/content/" + req.params.id + ".md", function (ferr, fdata) {
                if (ferr) {
                    throw ferr;
                }

                res.render("blog", {
                    article_title: data[0].title,
                    author: data[0].author,
                    time: data[0].time,
                    content: md.render(fdata.toString() || "")
                });
            });
        });
    });
}
