$(document).ready(function () {
    $("#logout").click(function () {
        $.post("/joplin/leave");
        window.location.href = "/joplin/login";
    });
});
