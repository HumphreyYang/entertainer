function search(){
    let order = localStorage.getItem("order");
    let key = localStorage.getItem("key");
    let range = localStorage.getItem("range");
    let content = localStorage.getItem("content");
    let page_num = parseInt(window.location.href.substr(window.location.href.lastIndexOf('/') + 1));

    $.get("/catalog/select/" + range + "/" + content + "/" + ((page_num - 1) * 20).toString() + "/" +  (page_num * 20) + "/" + key + "/" + order,
        function (data, status) {
            data = JSON.parse(data);
            $("tbody").empty();
            for (let i = 0; i < data.list.length; i++) {
                let node = "<tr><td><a href='/blog/" + data.list[i].id + "'>" + data.list[i].title +
                    "</a></td><td>" + data.list[i].tags + "</td><td>" + data.list[i].author + "</td><td>" + data.list[i].time + "</td></tr>";
                $("tbody").append(node);
            }

            let sum = Math.ceil( data.sum / 20);
            $("#page").empty();
            for (let i = 1; i <= sum; i++) {
                let node = "<button id='button" + i.toString() + "' class='page-button'>" + i.toString() + "</button>";
                $("#page").append(node);
            }

            for (let i = 1; i <= sum; i++) {
                $("#button" + i.toString()).click(function () {
                    window.location.href = "/catalog/" + i;
                });
            }

            $("#next").click(function () {
                if (page_num >= sum) {
                    return;
                }
                else {
                    window.location.href = "/catalog/" + (page_num + 1).toString();
                }
            });

            $("#prev").click(function () {
                if (page_num <= 1) {
                    return;
                }
                else {
                    window.location.href = "/catalog/" + (page_num - 1).toString();
                }
            });
    });
}

$(document).ready(function () {
    if (!localStorage.hasOwnProperty("range")) {
        localStorage.setItem("range", "any");
        localStorage.setItem("content", "[null]");
        localStorage.setItem("key", "time");
        localStorage.setItem("order", "1");
    }

    if (localStorage.getItem("content") !== "[null]") {
        $("#content_text").val(localStorage.getItem("content"));
    }

    if (localStorage.getItem("key") === "time") {
        if (localStorage.getItem("order") === "1") {
            $("#tma").attr("checked", "checked");
        }
        else {
            $("#tmd").attr("checked", "checked");
        }
    }
    else {
        if (localStorage.getItem("order") === "1") {
            $("#tta").attr("checked", "checked");
        }
        else {
            $("#ttd").attr("checked", "checked");
        }
    }

    $("#" + localStorage.getItem("range")).attr("selected", true);

    search();

    $("#content_text").change(function () {
        localStorage.setItem("content", $("#content_text").val());

        console.log($("#content_text").val());

        if (localStorage.getItem("content") === "") {
            localStorage.setItem("content", "[null]");
        }

        search();
    });

    $("#key").change(function () {
        localStorage.setItem("range", $(this).children("option:selected").val());
        search();
    });

    $("input[type=radio][name=order]").change(function () {
        if (this.value === "1") {
            localStorage.setItem("order", "1");
            localStorage.setItem("key", "time");
        }
        else if (this.value === "2") {
            localStorage.setItem("order", "-1");
            localStorage.setItem("key", "time");
        }
        else if (this.value === "3") {
            localStorage.setItem("order", "1");
            localStorage.setItem("key", "title");
        }
        else {
            localStorage.setItem("order", "-1");
            localStorage.setItem("key", "title");
        }

        search();
    });
});
