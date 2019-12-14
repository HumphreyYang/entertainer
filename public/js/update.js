let to_remove = [];

$(document).ready(function () {
    $("#logout").click(function () {
        $.post("/super/leave");
        window.location.href = "/super/login";
    });

    $(".remove_button").click(function () {
        to_remove.push($(this).attr("id"));
        $(this).parent().remove();
    });

    $("#save").click(function () {
        if ($("#pwd").val() !== $("#npwd").val()) {
            //TODO:
            return;
        }

        let fd = new FormData();
        fd.append("title", $("#title").val());
        fd.append("subtitle", $("#subtitle").val());
        fd.append("old password", $("#opwd").val());
        fd.append("new password", $("#npwd").val());
        fd.append("icon", $("#icon")[0].files[0]);
        fd.append("back", $("#back")[0].files[0]);
        fd.append("remove total", to_remove.length);
        fd.append("add", $("#md")[0].files[0]);
        fd.append("author", $("#author").val());
        fd.append("tags", $("#tags").val());
        fd.append("name", $("#name").val());

        console.log($("#icon")[0].files[0]);

        for (let i = 0; i < to_remove.length; i++) {
            fd.append("remove" + i, to_remove[i]);
        }

        $.ajax({
            url: "/super/write",
            type: "POST",
            cache: false,
            processData: false,
            contentType: false,
            data: fd,
            success: function (data) {
                console.log(data);
            }
        });

        $("#success").css("visibility", "visible");

        return false;
    });
});
