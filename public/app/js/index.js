var username;
var fullName;

function login()
{
    username = $("#username").val();
    var password = $("#password").val();
    $.mobile.loading("show");

    socket.emit("login",
    {
        "username" : username,
        "password" : password
    },
    function(callback)
    {
        if(callback.user != null)
        {
            $("table").each(function()
            {
                $(this).find("tr:gt(0)").remove()
            });

            $.mobile.changePage("#orders");
            $("#username").val("");
            $("#password").val("");
            fullName = callback.user.firstName + " " + callback.user.lastName;

            socket.emit("joinRoom",
            {
                "userID" : callback.user._id,
                "username" : username,
                "company" : callback.user.company.name,
                "companyID" : callback.user.company._id
            },
            function(callback){});
        }
        else
        {
            $("#showLoginError").trigger("click");
        }

        $.mobile.loading("hide");
    });
}

function logout()
{
    socket.emit("logout");
}