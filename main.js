let express = require("express");
let session = require("express-session");
let str_random = require("string-random");
let app = express();

let client = require("mongodb").MongoClient;
let db_url = "mongodb://localhost:27017";

client.connect(db_url,{ useUnifiedTopology: true }, function (err, db) {
    if (err) {
        throw err;
    }

    let database = db.db("entertainer");
    database.listCollections({name: "joplin"}).next(function (err, info) {
        if (!info) {
            database.createCollection("joplin", function (err, res) {
                if (err) {
                    throw err;
                }

                let init = {password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"};
                database.collection("joplin").insertOne(init,function (err, res) {
                    if (err) {
                        throw err;
                    }
                });

                let title = {title: "My Blog", subtitle: "welcome to my blog!"}
                database.collection("joplin").insertOne(title, function (err, res) {
                    if (err) {
                        throw err;
                    }
                })
            });

            database.createCollection("works", function (err, res) {
                if (err) {
                    throw err;
                }
            });
        }
    });
});

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(session({
    secret: str_random(),
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}));
app.use(express.static(__dirname + "/public"));

app.post("/joplin/sit/:pwd?", require("./joplin").visit);
app.post("/joplin/leave", require("./joplin").leave);

app.get("/", require("./index").index);
app.get("/catalog/:id", require("./catalog").catalog);
app.get("/blog/:id", require("./blog").blog);
app.get("/joplin/login", require("./joplin").login);
app.get("/joplin/update", require("./joplin").update);

let server = app.listen(3154, function () {
});
