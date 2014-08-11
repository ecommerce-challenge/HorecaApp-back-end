$(document).ready(function()
{
    // custom cart numeric input box events
    $(document).on("click", ".niCartPlus", function(e)
    {
        e.stopPropagation();
        var button = $(this);
        var input = $(button).parent().parent().find(".niInput");
        var value = $(input).val();
        var tr = $(button).closest("tr");

        if(parseInt(value) > 0)
            $(tr).addClass("selected");
        else
            $(tr).removeClass("selected");
    });

    $(document).on("click", ".niCartMinus", function(e)
    {
        e.stopPropagation();
        var button = $(this);
        var input = $(button).parent().parent().find(".niInput");
        var value = $(input).val();
        var tr = $(button).closest("tr");

        if(parseInt(value) > 0)
            $(tr).addClass("selected");
        else
            $(tr).removeClass("selected");
    });

    $(document).on("keyup", ".niCartInput", function(e)
    {
        e.stopPropagation();
        var input = $(this);
        var value = $(input).val();
        var tr = $(input).closest("tr");

        if(parseInt(value) > 0)
            $(tr).addClass("selected");
        else
            $(tr).removeClass("selected");
    });
});

$(document).on("pageshow", "#cart", function()
{
    checkCartEmpty()
});

function checkCartEmpty()
{
    if($("#tableCart tr").length > 1)
    {
        $("#tableCart").show();
        $("#cartEmpty").hide();
    }
    else
    {
        $("#tableCart").hide();
        $("#cartEmpty").show();
    }
}

function showCart()
{
    checkCartEmpty();
    $.mobile.loading("show");
    $.mobile.changePage("#cart", {transition : "slide"});
    $.mobile.loading("hide");
}

function addToCart(product)
{
    if(product.wasScanned)
        product.quantity = $("#scannedProductQuantity").val();

    $("#scannedProduct").popup("close");
    var numericInput = "<div class='numericInput' style='height: 30px !important; width: 94px !important; border: none !important;'><div class='niControlBox'><a class='niPlus niButton' style='height: 30px !important; width: 30px !important; line-height: 30px !important;'>+</a><a class='niMinus niButton' style='height: 30px !important; width: 30px !important; line-height: 30px !important;'>-</a></div><input class='niInput tableTextfield' style='height: 28px !important; width: 28px !important; text-align: center !important;' type='text' value='" + product.quantity + "'></div>";
    $("#tableCart tbody").append("<tr class='border'><td class='item_code tableHeader smallRow noBorder' style='border-right: 1px solid black !important;'><input class='tableTextfield' type='hidden' value='" + product.item_code + "'>" + product.item_name + "</td><td class='quantity noBorder' style='width: 93px;'>" + numericInput + "</td><td class='noBorder hiddenDataCell' style='width: 65px; border-left: 1px solid black !important;'><a class='ui-btn tableButton maxWidth red' onclick='removeFromCart(this);'>Remove</a><input class='hiItemName' type='hidden' value='" + product.item_name + "'/><input class='hiBarcode' type='hidden' value='" + product.barcode + "'/><input class='hiBrand' type='hidden' value='" + product.brand + "'/><input class='hiDescription' type='hidden' value='" + product.description + "'/><input class='hiImage' type='hidden' value='" + product.image + "'/><input class='hiSupplier' type='hidden' value='" + product.default_supplier + "'/></td></tr>");
    checkCartEmpty();
}

function removeFromCart(buttonClicked)
{
    $(buttonClicked).closest("tr").remove();
    checkCartEmpty();
}

function addCartToOrder()
{
    if($("#tableCart tr").length > 1)
    {
        var passedValidations = true;

        $("#tableCart tr:gt(0)").each(function()
        {
            var quantity = $(this).find(".quantity").find(".tableTextfield").val();

            if($.trim(quantity) == "" || parseInt(quantity) <= 0)
            {
                $(this).find(".tableHeader").addClass("required");
                passedValidations = false;
            }
            else
            {
                $(this).find(".tableHeader").removeClass("required");
            }
        });

        if(passedValidations)
        {
            $.mobile.loading("show");

            socket.emit("getSuppliers",
            function(callback)
            {
                if(callback != null)
                {
                    $("#selectSupplier").find("option:gt(0)").remove();
                    callback.data.forEach(function(i)
                    {
                        $("#selectSupplier").append("<option value='" + i.name + "'>" + i.name + "</option>");
                    });;
                    $("#selectSupplier")[0].selectedIndex = 0;
                    $("#selectSupplier").selectmenu("refresh", true);
                    $("#showCustomizeOrder").trigger("click");
                }
                else
                {
                    alert("Failed to fetch to suppliers. Please try again later.");
                }

                $.mobile.loading("hide");
            });
        }
    }
}


function showDatebox()
{
    $("#customizeOrder").popup("close");
    $("#datePickerBtn").trigger("click");
    $("#datePickerBtn").trigger("click");
}

function sendOrder()
{
    $("#customizeOrder").popup("close");

    var supplier = $("#selectSupplier").val();
    var data = {"supplier" : supplier};
    var po_details = [];
    var date = $("#receiveDate").val();

    $("#tableCart tr:gt(0)").each(function()
    {
        var item_code = $(this).find(".item_code").find(".tableTextfield").val();
        var description = $(this).find(".hiddenDataCell").find(".hiDescription").val();
        var item_name = $(this).find(".hiddenDataCell").find(".hiItemName").val();
        var brand = $(this).find(".hiddenDataCell").find(".hiBrand").val();
        var barcode = $(this).find(".hiddenDataCell").find(".hiBarcode").val();
        var image = $(this).find(".hiddenDataCell").find(".hiImage").val();
        var supplier = $(this).find(".hiddenDataCell").find(".hiSupplier").val();
        var quantity = $(this).find(".quantity").find(".tableTextfield").val();
        po_details.push({"item_code" : item_code, "item_name" : item_name, "qty" : quantity, "schedule_date" : date, "barcode" : barcode, "brand" : brand, "description" : description, "image" : image, "default_supplier" : supplier});
    });

    data["po_details"] = po_details;
    $.mobile.loading('show')
    socket.emit("insertPurchaseOrder", data,
    function(callback)
    {
        if(callback != null)
        {
            $("#tableCart").find("tr:gt(0)").remove();
            $("#selectSupplier").val("");
            checkCartEmpty();
            updateOrderList();
            $.mobile.changePage("#orders", {transition : "slide", reverse: true});
        }
        else
        {
            alert("Failed to insert the order into ERPNext, please try again.");
        }
        
        $.mobile.loading('hide')
    });
}