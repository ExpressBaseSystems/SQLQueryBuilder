
var SqlWhereClause = function ()
{
    this.init = function ()
    {
       
    };
    function abcd(el, target, source, sibling)
    {
        alert($(target).attr("id"));
    };
    this.makeDroppable = function ()
    {
        var drake = new dragula([document.getElementById("abc"), document.getElementsByClassName("conditiong-gp-container")], {
            copy: true,
        });
        drake.on("drop", abcd)
    };
    this.init();
};