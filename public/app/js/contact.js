$(document).on("pageshow", "#contact", function()
{
    updateUserList();
});

$(document).on("pagehide", "#contact", function()
{
	$("[href=#contact]").removeClass("cyan");
});

function updateUserList()
{
    $("[href=#contact]").removeClass("cyan");
    $.mobile.loading("show");

    socket.emit("getAllUsers",
    function(callback)
    {
        socket.emit("getUnreadMessages",
        {
            "currentUser" : username
        },
        function(unread)
        {
            var unreadSender;
            $("#tableUsers tbody tr").remove();

            callback.forEach(function(i)
            {
                unread.forEach(function(u)
                {
                    if(u.sender == i.username)
                        unreadSender = u.sender;
                });

                if(i.username != username)
                {
                    var prefix = "at";

                    if(i.role == "Owner")
                        prefix = "of"

                    var role = "<span class='greenBrand'>" + i.role + "</span> " + prefix + " <span class='brand'>" + i.company + "</span>";
                    var tr = $.parseHTML("<tr onclick='getConversation(" + JSON.stringify(i.username) + ", " + JSON.stringify(i.firstName + " " + i.lastName) + ");' class='border'><td class='noBorder horizontalPadding searchbox-cell'><input type='hidden' class='hiddenUserField' value='" + i.username + "'/><input class='searchbox-textfield' type='hidden' value='" + i.company + "'/><span class='floatLeft marginTop'>" + i.firstName + " " + i.lastName + "</span><span class='floatRight marginTop smallPrice'>" + role + "</span></td></tr>");
                    
                    if(i.username == unreadSender)
                        $(tr).addClass("cyan");

                    $("#tableUsers tbody").append(tr);
                }
            });

            $.mobile.loading("hide");
        });
    });
}