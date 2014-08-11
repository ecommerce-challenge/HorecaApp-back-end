$(document).ready(function()
{
    // selected dynamics
    $(document).on("click", ".selectable", function()
    {
        if(!$(this).hasClass("selected"))
            $(this).addClass("selected");
        else
            $(this).removeClass("selected");
    });

    // numeric input box
    $(document).on("click", ".niPlus", function(e)
    {
        e.stopPropagation();
        var button = $(this);
        var input = $(button).parent().parent().find(".niInput");
        var value = $(input).val();
        $(input).val(parseInt(value) + 1);
    });

    $(document).on("click", ".niMinus", function(e)
    {
        e.stopPropagation();
        var button = $(this);
        var input = $(button).parent().parent().find(".niInput");
        var value = $(input).val();

        if(parseInt(value) - 1 >= 0)
            $(input).val(parseInt(value) - 1);
    });

    $(document).on("click", ".niInput", function(e)
    {
        e.stopPropagation();
    });

    // searchbox dynamics
    $(document).on("change", ".searchbox", function()
    {
        var searchbox = $(this);
        var tableId = "#" + $(searchbox).attr("table-link");
        var input = $(searchbox).val().toLowerCase();

        if($.trim(input) == "")
            $(tableId + " tr").show();
    });

    $(document).on("keyup", ".searchbox", function()
    {
        var searchbox = $(this);
        var tableId = "#" + $(searchbox).attr("table-link");
        var input = $(searchbox).val().toLowerCase();

        if($.trim(input) != "")
        {
            $(tableId + " tr").hide();

            $(tableId + " tr").each(function()
            {
                var row = $(this);
                var td = $(row).find(".searchbox-cell");
                var textfield = $(td).find(".searchbox-textfield");
                var val = $(textfield).val().toLowerCase();

                if(val.indexOf(input) >= 0)
                    $(row).show();
            });
        }
        else
            $(tableId + " tr").show();
    });
});