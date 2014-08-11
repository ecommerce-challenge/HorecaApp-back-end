var contact;
var contactFullName;

$(document).ready(function()
{
    socket.on("messageReceived", function(data)
    {
        updateUserList();

    	if(contact == data.sender && $.mobile.activePage.attr("id") == "chat")
    	{
            var PM = $.parseHTML("<div class='maxWidth clearBoth'><div class='PM received'><div class='PM_sender showPM'><span class='PM_time'>" + data.time + "</span><span class='PM_name'>" + contactFullName + "</span></div><div class='PM_message'></div></div></div>");
            $(PM).find(".PM_message").text(data.message);
            $("#PM_Container").append(PM);
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
    	}

        if(contact != data.sender)
        {
            $("[href=#contact]").addClass("cyan");
        }
    });
});

$(document).on("pageshow", "#chat", function()
{
    $("html, body").animate({ scrollTop: $(document).height() });
});

$(document).on("pagehide", "#chat", function()
{
    socket.emit("markAsRead",
    {
        "currentUser" : username,
        "sender" : contact
    });
    
    contact = null;
    contactFullName = null;
});

function getConversation(_contact, _contactFullName)
{
    contact = _contact;
    contactFullName = _contactFullName;
    $.mobile.loading("show");

    socket.emit("getConversation",
    {
        "currentUser" : username,
        "contact" : contact
    },
    function(callback)
    {
        var conversation = [];

        $("#PM_Container").children().remove();

        callback.sent.forEach(function(i)
        {
            i.type = "sent";
            conversation.push(i);
        });

        callback.received.forEach(function(i)
        {
            i.type = "received";
            conversation.push(i);
        });

        conversation.sort(function(a,b){if (a._id < b._id)return -1;if (a._id > b._id)return 1;return 0;});

        conversation.forEach(function(i)
        {
            if(i.type == "sent")
            {
                var PM = $.parseHTML("<div class='maxWidth clearBoth'><div class='PM sent'><div class='PM_sender showPM'><span class='PM_time'>" + i.time + "</span><span class='PM_name'>" + fullName + "</span></div><div class='PM_message'></div></div></div>");
                $(PM).find(".PM_message").text(i.message);
                $("#PM_Container").append(PM);
            }
            else
            {
                var PM = $.parseHTML("<div class='maxWidth clearBoth'><div class='PM received'><div class='PM_sender showPM'><span class='PM_time'>" + i.time + "</span><span class='PM_name'>" + contactFullName + "</span></div><div class='PM_message'></div></div></div>");
                $(PM).find(".PM_message").text(i.message);
                $("#PM_Container").append(PM);
            }
        });

        $.mobile.loading("hide");

        $.mobile.changePage("#chat", {transition : "flow"});

    	socket.emit("markAsRead",
	    {
	        "currentUser" : username,
	        "sender" : contact
	    });
    });
}

function sendMessage(message)
{
    $("#chatbox").focus();
    
    if($.trim(message) != "")
    {
        $("#chatbox").val("");
        
        socket.emit("sendMessage",
        {
            "currentUser" : username,
            "contact" : contact,
            "message" : message
        },
        function(callback)
        {
            var PM = $.parseHTML("<div class='maxWidth clearBoth'><div class='PM sent'><div class='PM_sender showPM'><span class='PM_time'>" + callback.time + "</span><span class='PM_name'>" + fullName + "</span></div><div class='PM_message'></div></div></div>");
            $(PM).find(".PM_message").text(callback.message);
            $("#PM_Container").append(PM);
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
        });
    }
}