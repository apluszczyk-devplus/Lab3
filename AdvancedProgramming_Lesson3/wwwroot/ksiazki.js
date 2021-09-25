const uri = "https://localhost:44354/api/Books";
let books = null;
function getCount(data) {
    const el = $("#counter");
    let name = "książek";
    if (data) {
        if (data > 1 && data < 5) {
            name = "książki";
        } else if (data == 1) {
            name = "książka"
        } else {
            name = "książek"
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
            const tBody = $("#books");
            $(tBody).empty();
            getCount(data.length);
            $.each(data, function (key, item) {
                const tr = $("<tr></tr>")
                    .append(
                        $("<td></td>").append(
                            $(`<span>Pozycja ${key + 1}</span>`)
                        )
                    )
                    .append($("<td></td>").text(item.author))
                    .append($("<td></td>").text(item.title))
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
            books = data;
        }
    });
}
function addItem() {
    const item = {
        author: $("#add-author").val(),
        title: $("#add-title").val(),
    };
    $.ajax({
        type: "POST",
        accepts: "application/json",
        url: uri + '/CreateBook',
        contentType: "application/json",
        data: JSON.stringify(item),
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Something went wrong!");
        },
        success: function (result) {
            getData();
            $("#add-author").val("");
            $("#add-title").val("");
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
    $.each(books, function (key, item) {
        if (item.id === id) {
            $("#edit-author").val(item.author);
            $("#edit-title").val(item.title);
            $("#edit-id").val(item.id);
        }
    });
    $("#spoiler").css({ display: "block" });
}

function updateItem() {
    var id = parseInt($("#edit-id").val(), 10);
    const item = {
        id: id,
        author: $("#edit-author").val(),
        title: $("#edit-title").val(),
    };
    $.ajax({
        type: "POST",
        accepts: "application/json",
        url: uri + '/UpdateBook',
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