$(document).on("pageshow", "#items", function()
{
    $(".searchbox").val("");
    searchItems();
});

function searchItems()
{
    $.mobile.loading("show");

    socket.emit("getItems", function(callback)
    {
        $("#tableItems tbody tr").remove();
        
        if(callback != null)
        {
            callback.data.forEach(function(i)
            {
                var numericInput = $.parseHTML("<div class='numericInput absolute absBottomRight'><div class='niControlBox'><a class='niPlus niButton niCartPlus'>+</a><a class='niMinus niButton niCartMinus'>-</a></div><input class='niInput niCartInput' type='text' value='0'></div>");
                var tableRow = $.parseHTML("<tr class='selectable'><td class='imageColumn searchbox-cell'><input class='it_item_name searchbox-textfield' type='hidden' value='" + i.item_name + "'/><input type='hidden' class='it_item_code' value='" + i.item_code + "'/><input class='it_image' type='hidden' value='" + i.image + "'/><input class='it_barcode' type='hidden' value='" + i.barcode + "'/><input class='it_description' type='hidden' value='" + i.description + "'/><input class='it_brand' type='hidden' value='" + i.brand + "'/><input class='it_supplier' type='hidden' value='" + i.default_supplier + "'/><div class='image'></div></td><td><div class='itemHeader'><span class='brand'>" + i.brand + "</span> - " + i.item_name + " <span class='smallPrice'>[" + i.barcode + "]</span></div><div class='itemDescription wordwrap' style='position: relative !important;'>" + i.description + "<span class='smallPrice' style='position: absolute; bottom: 3px; left: 8px;'>" + i.default_supplier + "</span></div></td></tr>");
                $(tableRow).find(".itemDescription").append(numericInput);

                if(i.image != null)
                {
                    var image = i.image;

                    if(i.image.substring(1, 6) == "files")
                        var image = "https://horecajeppie.frappecloud.com" + i.image;

                    $(tableRow).find(".imageColumn").find(".image").css
                    ({
                        "background" : "url('" + image + "')",
                        "width" : "80px",
                        "height" : "80px",
                        "background-size" : "100% 100%",
                        "background-repeat" : "no-repeat"
                    });
                }
                else
                {
                    $(tableRow).find(".imageColumn").find(".image").css
                    ({
                        "background" : "url('app/img/noimage.png')",
                        "width" : "80px",
                        "height" : "80px",
                        "background-size" : "100% 100%",
                        "background-repeat" : "no-repeat"
                    });
                }

                $("#tableItems tbody").append(tableRow);
            });

            $.mobile.changePage("#items", {transition : "slide"});
        }
        else
        {
            alert("Failed to get the list of items. Please try again later.");
        }

        $.mobile.loading("hide");
    });
}

function addItems()
{
    $("#tableItems tbody tr").each(function()
    {
        if($(this).hasClass("selected"))
        {
            var it_item_code = $(this).find(".imageColumn").find(".it_item_code").val();
            var it_item_name = $(this).find(".imageColumn").find(".it_item_name").val();
            var it_barcode = $(this).find(".imageColumn").find(".it_barcode").val();
            var it_brand = $(this).find(".imageColumn").find(".it_brand").val();
            var it_description = $(this).find(".imageColumn").find(".it_description").val();
            var it_supplier = $(this).find(".imageColumn").find(".it_supplier").val();
            var it_image = $(this).find(".imageColumn").find(".it_image").val();
            var quantity = $(this).find(".niInput").val();
            addToCart({"item_code" : it_item_code, "item_name" : it_item_name, "quantity" : quantity, "barcode" : it_barcode, "brand" : it_brand, "description" : it_description, "default_supplier" : it_supplier, "image" : it_image});
        }
    });

    showCart();
}