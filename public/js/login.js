$(document).ready(function () {
    $("#submit").click(function () {
        let val = $("#pwd").val();
        $.post("/joplin/sit/" + val,
           function (data, status) {
                if (JSON.parse(data)["status"] === "yes") {
                    window.location.href = "/joplin/update";
                }
                else {
                    //TODO:
                }
           });
    });
});
