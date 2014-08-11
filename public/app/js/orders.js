$(document).on("pageshow", "#orders", function()
{
    updateOrderList();
});

function updateOrderList()
{
    $.mobile.loading('show');

    socket.emit("getPurchaseOrders",
    function(callback)
    {
        $("#tableOrders tbody tr").remove();

        if(callback != null)
        {
            callback.data.forEach(function(i)
            {
                if(i.status != "Cancelled")
                {
                    if(i.status == "Draft")
                        var row = "<tr class='border' onclick='getOrderDetails(" + JSON.stringify(i.name) + ")'><td class='noBorder horizontalPadding'><span class='floatLeft marginTop'>" + i.name + " <span class='bold brand'>[" + i.supplier + "]</span></span><span class='floatRight smallPrice bold marginTop'><span class='redBrand'>[Pending]</span> - " + i.creation.substring(0, 19) + "</span></td></tr>";
                    else
                        var row = "<tr class='border' onclick='getOrderDetails(" + JSON.stringify(i.name) + ")'><td class='noBorder horizontalPadding'><span class='floatLeft marginTop'>" + i.name + " <span class='bold brand'>[" + i.supplier + "]</span></span><span class='floatRight smallPrice bold marginTop'><span class='greenBrand'>[" + i.status + "]</span> - " + i.creation.substring(0, 19) + "</span></td></tr>";
                   
                    $("#tableOrders tbody").append(row);
                }
            });
        }
        else
        {
            alert("Failed to get the list of orders. Please try again later.");
        }

        $.mobile.loading('hide');
    });
}

function getOrderDetails(name)
{
    $.mobile.loading("show");
    $.mobile.changePage("#order_details", {transition : "slide"});
    $("#h1_orderDetails").text("Order details -> " + name);
    $("#tableOrderDetails tbody tr").remove();

    socket.emit("getPurchaseOrder", name,
    function(callback)
    {
        if(callback != null)
        {
            callback.data.po_details.forEach(function(i)
            {
                $("#tableOrderDetails tbody").append("<tr class='border'><td class='tableHeader smallRow noBorder'>" + i.item_name + "</td><td class='smallRow noBorder'><b>Quantity: </b> " + i.qty + "</td><td class='smallRow noBorder'><b>Price: </b>&euro; " + i.amount + " <span class='smallPrice'>&euro; " + i.rate + " each</span>" + "</td></tr>");
            });
        }
        else
        {
            alert("Failed to get the details of this order. Please try again later.");
        }

        $.mobile.loading("hide");
    });
}