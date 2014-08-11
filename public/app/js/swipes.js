$(document).on("pagecreate", "#orders", function()
{
    // when swiping in page: orders
    $("#orders").on("swipeleft", function()
    {
        $.mobile.changePage("#contact", {transition : "slide"});
    });
});

$(document).on("pagecreate", "#contact", function()
{
    // when swiping in page: users
    $("#contact").on("swiperight", function()
    {
        $.mobile.changePage("#orders", {transition : "slide", reverse: true});
    });

    $("#contact").on("swipeleft", function()
    {
        $.mobile.changePage("#cart", {transition : "slide"});
    });
});

$(document).on("pagecreate", "#chat", function()
{
    // when swiping in page: chat
    $("#chat").on("swiperight", function()
    {
        $.mobile.changePage("#contact", {transition : "slide", reverse: true});
    });
});

$(document).on("pagecreate", "#cart", function()
{
    // when swiping in page: cart
    $("#cart").on("swiperight", function()
    {
        $.mobile.changePage("#contact", {transition : "slide", reverse: true});
    });

    $("#cart").on("swipeleft", function()
    {
        $.mobile.changePage("#items", {transition : "slide"});
    });
});

$(document).on("pagecreate", "#items", function()
{
    // when swiping in page: cart
    $("#items").on("swiperight", function()
    {
        $.mobile.changePage("#cart", {transition : "slide", reverse: true});
    });
});