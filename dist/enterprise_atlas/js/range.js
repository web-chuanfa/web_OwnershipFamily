//左右滑动筛选
$(function() {
$('.range-slider').jRange({
    from: 0,
    to: 100,
    step: 1,
    scale: [0, 25, 50, 75, 100],
    format: '%s',
    width: 300,
    showLabels: true,
    isRange: true
});
$("#filter").click(function() {
    var rangeVal = $(".range-slider").val(),
        rangeValue = "";
    rangeValue = rangeVal.split(",");
    $("#filterStock").hide();
    var min = rangeValue[0],
        max = rangeValue[1];
    myChart.clear(); //清空图表
    getData(min, max);
});
});
//确认筛选时，用隐藏筛选区域
function filter() {
    // $("#filterStock").show();
    if ($("#filterStock").css("display") == "none") {
        $("#filterStock").css("display", "block")
    } else {
        $("#filterStock").css("display", "none")
    }
}