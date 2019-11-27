exports.catalog = function (req, res, next) {
    res.render("catalog", {
        blog_title: "Neil Kleist Gao's Blog",
        list: [{title: "title", tag: "test", author: "Neil Kleist Gao", time: "2001-08-28", id:"1"},
            {title: "title", tag: "test", author: "Neil Kleist Gao", time: "2001-08-28", id:"2"},
            {title: "title", tag: "test", author: "Neil Kleist Gao", time: "2001-08-28", id:"3"},
            {title: "title", tag: "test", author: "Neil Kleist Gao", time: "2001-08-28", id:"4"},
            {title: "title", tag: "test", author: "Neil Kleist Gao", time: "2001-08-28", id:"5"},
            {title: "title", tag: "test", author: "Neil Kleist Gao", time: "2001-08-28", id:"6"},
            {title: "title", tag: "test", author: "Neil Kleist Gao", time: "2001-08-28", id:"7"},
            {title: "title", tag: "test", author: "Neil Kleist Gao", time: "2001-08-28", id:"8"},
            {title: "title", tag: "test", author: "Neil Kleist Gao", time: "2001-08-28", id:"9"},
            {title: "title", tag: "test", author: "Neil Kleist Gao", time: "2001-08-28", id:"10"}
        ],
        pages: 5,
        more: false
    });
}
