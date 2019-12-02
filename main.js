let express = require("express");
let app = express();

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
