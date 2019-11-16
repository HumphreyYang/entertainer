exports.index = function (req, res, next) {
    res.render("index", {blog_title: "Neil Kleist Gao's Blog",
        name:"Neil Kleist Gao",
        intro: "Hello! Welcome to my blog!",
        list: [{id: 0, title: "hello world"},
            {id: 1, title: "about engine"},
            {id: 2, title: "how to learn node js"},
            {id: 3, title: "my school"},
            {id: 4, title: "summary"}]
    });
}
