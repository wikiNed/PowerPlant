/**
 * 作       者：StampGIS Team
 * 创建日期：2017年7月22日
 * 描        述：搜索相关功能
 * 注意事项：
 * 遗留bug：0
 * 修改日期：2017年11月8日
 ******************************************/

$(window).resize(function(){
	var divHeight = $("#id_left_operator", parent.document).height() - 180;
	$("#dgDiv").height(divHeight);
	$("#srcollDiv").height(divHeight - 30);
	$("#srcollDiv").mCustomScrollbar({}); //滚动条
})

var divHeight = $("#id_left_operator", parent.document).height() - 180;
$("#dgDiv").height(divHeight);
$("#srcollDiv").height(divHeight - 30);
$("#srcollDiv").mCustomScrollbar({}); //滚动条

window.onunload = function() {
	//search.clearBolloan();
};

