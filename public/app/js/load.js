var socket;
var controlPanel;

$(document).ready(function()
{
    // connect to the server trough a socket
    socket = io.connect("http://ec2-54-73-0-85.eu-west-1.compute.amazonaws.com");
});

// before a new "page" is about to be shown
$(document).on("pagebeforeshow", function()
{
    // highlights the button that has the same href as the current url
    var currentPage = $.mobile.activePage.attr("id");
    $("[href]").removeClass("active");
    $("[href=#" + currentPage + "]").addClass("active");
});