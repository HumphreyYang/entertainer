exports.catalog = function (req, res, next) {

    let client = require("mongodb").MongoClient;
    let db_url = "mongodb://localhost:27017";

    client.connect(db_url, {useUnifiedTopology: true}, function (err, db) {
        if (err) {
            throw err;
        }

        let database = db.db("entertainer");
        database.collection("super").find({}).toArray(function (err1, data) {
            if (err1) {
                throw err1;
            }

            res.render("catalog", {
                blog_title: data[1].title
            });
        });
    })
}

exports.select = function (req, res, next) {
    let client = require("mongodb").MongoClient;
    let fs = require("fs");
    let db_url = "mongodb://localhost:27017";

    client.connect(db_url, {useUnifiedTopology: true}, function (err, db) {
        if (err) {
            throw err;
        }

        let database = db.db("entertainer");

        let find_params = {};
        if (req.params.content !== "[null]") {
            if (req.params.range === "any") {
                find_params["$or"] = [{
                    title: {$regex: req.params.content}
                },{
                    time: {$regex: req.params.content}
                },{
                    author: {$regex: req.params.content}
                },{
                    tags: {$regex: req.params.content}
                }];
            }
            else if (req.params.range !== "content") {
                find_params[req.params.range] = {$regex: req.params.content};
            }
        }

        let sort_params = {};
        sort_params[req.params.key] = parseInt(req.params.order);

        database.collection("works").find(find_params).sort(sort_params).toArray(function (err1, data) {
            let json = {list: [], sum: 0};
            if (req.params.range !== "content") {
                json.sum = data.length;
                for (let i = req.params.min; i < Math.min(req.params.max, data.length); i++) {
                    json.list.push({
                        id: data[i]._id,
                        tags: data[i].tags,
                        title: data[i].title,
                        author: data[i].author,
                        time: data[i].time
                    });
                }
            }
            else if (req.params.content !== "[null]") {
                let total = 0;
                for (let i = req.params.min; i <data.length; i++) {
                    let temp = fs.readFileSync("./public/content/" + data[i]._id.toString() + ".md");
                    if (temp.indexOf(req.params.content) !== -1 && total < 20) {
                        total++;
                        json.list.push({
                            id: data[i]._id,
                            tags: data[i].tags,
                            title: data[i].title,
                            author: data[i].author,
                            time: data[i].time
                        });
                    }
                }

                json.sum = total;
            }

            res.json(JSON.stringify(json));
        });
    });
}
