exports.blog = function (req, res, next) {
    res.render("blog", {
        article_title: "hello world",
        author: "Neil Kleist Gao",
        time: "2019-12-02",
        content: "<small>hello</small><hr><p>world</p>",
        previous: "/catalog/1"
    });
}
