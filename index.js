exports.index = function (req, res, next) {
    let client = require("mongodb").MongoClient;
    let db_url = "mongodb://localhost:27017";

    client.connect(db_url, { useUnifiedTopology: true }, function (err, db) {
        if (err) {
            throw err;
        }

        let database = db.db("entertainer");
        database.collection("super").find({}).toArray(function (err1, data1) {
            if (err1) {
                throw err1;
            }

            database.collection("works").find({}).sort({time: -1}).toArray(function (err2, data2) {
                if (err2) {
                    throw err2;
                }

                let list = [];
                for (let i = 0; i < Math.min(data2.length, 5); i++) {
                    list.push({
                        id: data2[i]._id,
                        title: data2[i].title
                    });
                }

                res.render("index", {
                    blog_title: data1[1].title,
                    intro: data1[1].subtitle,
                    list: list
                });
            });
        });
    })


}
