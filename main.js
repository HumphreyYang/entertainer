let express = require("express");
let session = require("express-session");
let str_random = require("string-random");
let multiparty = require("connect-multiparty");

let app = express();
let mp = multiparty();

let client = require("mongodb").MongoClient;
let db_url = "mongodb://localhost:27017";

client.connect(db_url,{ useUnifiedTopology: true }, function (err, db) {
    if (err) {
        throw err;
    }

    let database = db.db("entertainer");
    database.listCollections({name: "super"}).next(function (err, info) {
        if (!info) {
            database.createCollection("super", function (err, res) {
                if (err) {
                    throw err;
                }

                let init = {password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"};
                database.collection("super").insertOne(init,function (err, res) {
                    if (err) {
                        throw err;
                    }
                });

                let title = {title: "My Blog", subtitle: "welcome to my blog!"}
                database.collection("super").insertOne(title, function (err, res) {
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

app.post("/super/sit/:pwd?", require("./super").visit);
app.post("/super/leave", require("./super").leave);
app.post("/super/write", mp, require("./super").write);

app.get("/catalog/select/:range/:content/:min/:max/:key/:order", require("./catalog").select);
app.get("/", require("./index").index);
app.get("/catalog/:id", require("./catalog").catalog);
app.get("/blog/:id", require("./blog").blog);
app.get("/super/login", require("./super").login);
app.get("/super/update", require("./super").update);

let server = app.listen(8080, function () {
});
