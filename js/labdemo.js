//getjson
var strArr = null;
var labXn = {
    htmlBalloon:[],
    propertyDiv:null,
    propertyHtml:null,
    labClick:false
};
var labArr = [
    {
        name:'财会模拟与分析室',
        lng:109.41307122206838,
        lat:38.03529740932463,
        alt:1091.30,
        layerid:'6e09b9bf-14c0-499d-9e34-8f48986aa0e0'
    },
    {
        name:'创业实训室',
        lng:109.41331843241691,
        lat:38.035257895084065,
        alt:1091.53,
        layerid:'abd0811a-e6ac-4b22-b639-2de470f06623'
    }
];
$.ajax({
    type: "GET",
    url:"http://2045j691n6.iask.in:10534/api/app/GetRooms?floorNo=1",
    dataType:'json',
    success:function(data){
        strArr = JSON.parse(JSON.stringify(data.Data));
    },
    error:function(e){
        alert(e);
    }
});
function showLab(){
    // strArr[6].layerid = labArr[0].layerid;
    // strArr[6].lng = labArr[0].lng;
    // strArr[6].lat = labArr[0].lat;
    // strArr[6].alt = labArr[0].alt;
    // strArr[6].index = labArr[0].index;
    // var show = function (){
    //     labCreate(labArr[0],strArr[6]);
    // };
    // setTimeout(function () {
    //     show();
    // },1000);
    //
    //
    //
    // strArr[9].layerid = labArr[1].layerid;
    // strArr[9].lng = labArr[1].lng;
    // strArr[9].lat = labArr[1].lat;
    // strArr[9].alt = labArr[1].alt;
    // strArr[9].index = labArr[1].index;
    // var show1 = function (){
    //     labCreate(labArr[1],strArr[9]);
    // };
    // show1();

    //Promise 不支持
    // function first (){
    //     var p = new Promise(function(resolve,reject){
    //         labCreate(labArr[0],strArr[6]);
    //     });
    //     return p;
    // };

    // function second() {
    //     var p = new Promise(function(resolve,reject){
    //         labCreate(labArr[1],strArr[9]);
    //     });
    //     return p;
    // }
    // first().then(function () {
    //     second();
    // });
    strArr.forEach(function (item) {
        for (var i = 0, length = labArr.length; i < length; i++) {
                if( item.RoomName == labArr[i].name ){
                    // alert(item.RoomName);
                    item.layerid = labArr[i].layerid;
                    item.lng = labArr[i].lng;
                    item.lat = labArr[i].lat;
                    item.alt = labArr[i].alt;
                    labCreate(labArr[i],item);
                    alert("数据匹配成功");
                }
            };

        })

};
function labCreate(point,item){
        var htmlBalloon = LayerManagement.earth.Factory.CreateHtmlBalloon(LayerManagement.earth.Factory.CreateGuid(), '实验室');
        labXn.htmlBalloon.push(htmlBalloon);
        htmlBalloon.SetSphericalLocation(point.lng,point.lat,point.alt);
        if( item.Meg != "" ){
            htmlBalloon.SetRectSize(220, 130);
        }else{
            htmlBalloon.SetRectSize(220, 70);
        }
        htmlBalloon.SetTailColor(parseInt("0x88000000"));
        htmlBalloon.SetIsAddCloseButton(false);
        htmlBalloon.SetIsAddMargin(false);
        htmlBalloon.SetIsAddBackgroundImage(true);
        htmlBalloon.SetIsTransparence(false);


        earth.Event.OnDocumentReadyCompleted = function (guid) {//气泡加载完成事件
            if (guid == htmlBalloon.guid) {
                labXn.setBalloonParameters(item);
                labXn.setBalloonContents(item);
            }
        };
        //
        //传递参数
        labXn.setBalloonParameters = function(item) {
            var parameter = {};
            parameter.updatePowerPlantDiv = function (div) {
                labXn.propertyDiv = div;
            };
            parameter.item = item;
            parameter.lab = labXn;
            htmlBalloon.InvokeScript('setParameters', parameter);
        };

        labXn.setBalloonContents = function(item) {
        //alert("setBalloonContents");
        //     alert(item.RoomName);
            var propertyHtml = "";
            if( item.Meg != '' ){
                propertyHtml += "<div class='error'><p id='name' value="+item.layerid+">房间名称："+item.RoomName+"</p>";
                propertyHtml += "<p id='Meg'>错误信息："+item.Meg+"</p>";
            }else{
                propertyHtml += "<div><p id='name' value="+point.layerid+">房间名称："+item.RoomName+"</p>";
            };
            propertyHtml +="</div>";
            alert(propertyHtml);
            labXn.propertyHtml = propertyHtml;
            alert(labXn.propertyHtml);
            var propertyDiv = labXn.propertyDiv.find(".content");
            propertyDiv.html(labXn.propertyHtml);
        };
        // labXn.createHtmlBollon();
        htmlBalloon.SetBackgroundRGB(0x2167A3);
        htmlBalloon.SetBackgroundAlpha(0);
        var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        var url = windowUrl + '/html/wendu1.html';
        htmlBalloon.ShowNavigate(url);
};

// labXn.createHtmlBollon = function(){
//     alert("create");
//     htmlBalloon.SetBackgroundRGB(0x2167A3);
//     htmlBalloon.SetBackgroundAlpha(0);
//     var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
//     var url = windowUrl + '/html/wendu1.html';
//     htmlBalloon.ShowNavigate(url);
// };


labXn.changeLayer = function (id,point){
    var layerManager = STAMP.LayerManager(earth);
    var layer = earth.LayerManager.GetLayerByGUID(id);
    // alert(LayerManagement.groupLayers[0].id);
    function getParent(layer) {
        var parent = null;
        for (var i = 0, length = LayerManagement.groupLayers.length; i < length; i++) {
            if (layer.Guid == LayerManagement.groupLayers[i].id){
                parent =  LayerManagement.groupLayers[i].parent;
            }
        };
        return parent;
    }
    var parentLayer = getParent(layer);
    for (var i = 0, length = LayerManagement.groupLayers.length; i < length; i++) {
        if (LayerManagement.groupLayers[i].parent == parentLayer){
            var layerObj = earth.LayerManager.GetLayerByGUID(LayerManagement.groupLayers[i].id);
            layerObj.Visibility = false;

        }
    };
    if(layer.LayerType) {
        layer.Visibility = true;
        layerManager.flyToLayer(layer); //定位图层
    };

    var htmlBalloon = LayerManagement.earth.Factory.CreateHtmlBalloon(LayerManagement.earth.Factory.CreateGuid(), '实验室');
    labXn.htmlBalloon.push(htmlBalloon);
    htmlBalloon.SetSphericalLocation(point.lng,point.lat,point.alt);
    htmlBalloon.SetRectSize(325, 220);
    htmlBalloon.SetTailColor(parseInt("0x88000000"));
    htmlBalloon.SetIsAddCloseButton(false);
    htmlBalloon.SetIsAddMargin(true);
    htmlBalloon.SetIsAddBackgroundImage(true);
    htmlBalloon.SetIsTransparence(false);
    labXn.labClick = !labXn.labClick;
    var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    var url = windowUrl + '/html/labmsg.html';
    htmlBalloon.ShowNavigate(url);
}



















