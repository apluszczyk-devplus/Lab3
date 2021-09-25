const uri = "https://localhost:44354/api/People";
let people = null;
function getCount(data) {
    const el = $("#counter");
    let name = "osób";
    if (data) {
        if (data > 1) {
            name = "osoby";
        } else {
            name = "osoba"
        }
        el.text(data + " " + name);
    } else {
        el.text("Brak " + name);
    }
}
$(document).ready(function () {
    getData();
});
function getData() {
    $.ajax({
        type: "GET",
        url: uri,
        cache: false,
        success: function (data) {
            const tBody = $("#people");
            $(tBody).empty();
            getCount(data.length);
            $.each(data, function (key, item) {
                const tr = $("<tr></tr>")
                    .append(
                        $("<td></td>").append(
                            $(`<span>Pozycja ${key + 1}</span>`)
                        )
                    )
                    .append($("<td></td>").text(item.name))
                    .append($("<td></td>").text(item.surname))
                    .append(
                        $("<td></td>").append(
                            $("<button>Edycja</button>").on("click", function () {
                                editItem(item.id);
                            })
                        )
                    )
                    .append(
                        $("<td></td>").append(
                            $("<button>Usuń</button>").on("click", function () {
                                deleteItem(item.id);
                            })
                        )
                    );
                tr.appendTo(tBody);
            });
            people = data;
        }
    });
}
function addItem() {
    const item = {
        name: $("#add-name").val(),
        surname: $("#add-surname").val(),
    };
    $.ajax({
        type: "POST",
        accepts: "application/json",
        url: uri + '/CreatePerson',
        contentType: "application/json",
        data: JSON.stringify(item),
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Something went wrong!");
        },
        success: function (result) {
            getData();
            $("#add-name").val("");
            $("#add-surname").val("");
        }
    });
}

function deleteItem(id) {
    $.ajax({
        url: uri + "/" + id,
        type: "DELETE",
        success: function (result) {
            getData();
        }
    });
}

function editItem(id) {
    $.each(people, function (key, item) {
        if (item.id === id) {
            $("#edit-name").val(item.name);
            $("#edit-surname").val(item.surname);
            $("#edit-id").val(item.id);
        }
    });
    $("#spoiler").css({ display: "block" });
}

function updateItem() {
    var id = parseInt($("#edit-id").val(), 10);
    const item = {
        id: id,
        name: $("#edit-name").val(),
        surname: $("#edit-surname").val(),
    };
    $.ajax({
        type: "POST",
        accepts: "application/json",
        url: uri + '/UpdatePerson',
        contentType: "application/json",
        data: JSON.stringify(item),
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Something went wrong!");
        },
        success: function (result) {
            getData();
            closeInput();
        }
    });
}

function closeInput() {
    $("#spoiler").css({ display: "none" });
}