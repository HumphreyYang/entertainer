$(document).ready(function () {
    $("#submit").click(function () {
        let val = $("#pwd").val();
        $.post("/super/sit/" + val,
           function (data, status) {
                if (JSON.parse(data)["status"] === "yes") {
                    window.location.href = "/super/update";
                }
                else {
                    $("#wrong").css('visibility','visible');
                }
           });
    });
});
