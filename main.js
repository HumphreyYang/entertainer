let express = require("express");
let app = express();

let client = require("mongodb").MongoClient;
let db_url = "mongodb://localhost:27017";

client.connect(db_url,{ useUnifiedTopology: true }, function (err, db) {
    if (err) {
        throw err;
    }

    let database = db.db("entertainer");
    let flag = false;
    database.listCollections({name: "joplin"}).next(function (err, collinfo) {
        if (collinfo) {
            flag = true;
        }
    });

    if (!flag) {
        database.createCollection("joplin", function (err, res) {
            if (err) {
                throw err;
            }
        });

        database.createCollection("works", function (err, res) {
            if (err) {
                throw err;
            }
        });

        let init = {password: "1234567"};
        database.collection("joplin").insertOne(init,function (err, res) {
            if (err) {
                throw err;
            }

            console.log("initialization finished.");
            db.close();
        });
    }
});

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

app.get("/", require("./index").index);
app.get("/catalog/:id", require("./catalog").catalog);
app.get("/blog/:id", require("./blog").blog);
app.get("/joplin/login", require("./joplin").login)
app.get("/joplin/update", require("./joplin").update)

let server = app.listen(3154, function () {
});
