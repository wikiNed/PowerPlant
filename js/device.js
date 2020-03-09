//index time
(function () {
    showtime();
    setInterval(function () {
        showtime();
    }, 1000);

    function showtime() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours().toString();
        var minutes = date.getMinutes().toString();
        var seconds = date.getSeconds().toString();
        var tArry = [hour, minutes, seconds];
        tArry.forEach(function (item, index) {
            var iArry = item.split('');
            if (iArry.length < 2) {
                item = '0' + item;
            }
            ;
            if (index == 0) {
                hour = item;
            }
            if (index == 1) {
                minutes = item;
            }
            if (index == 2) {
                seconds = item;
            }
        });

        var $left = $('#header .left');
        var $right = $('#header .right');
        $left.html(year + " - " + month + " - " + day);
        $right.html(hour + ": " + minutes + ": " + seconds);
    }
})();
PowerPlant.device = [];
setTimeout(function () {
    //PowerPlant.searchAllDevice();
    //alert(PowerPlant.device.length);
}, 500);
//搜索所有图层
PowerPlant.searchAllDevice = function () {
    var layersArr = [];
    var allDeviceLayers = PowerPlant._getLayerByName("设备");
    var count = allDeviceLayers.GetChildCount();
    alert(count);
    for (let i = 0, length = count; i < length; i++) {
        var deviceLayers = allDeviceLayers.GetChildAt(i);
        if (deviceLayers.GetChildCount() != 0) {
            for (let i = 0, length = deviceLayers.GetChildCount(); i < length; i++) {
                layersArr.push(deviceLayers.GetChildAt(i));
            }
        } else {
            layersArr.push(deviceLayers);
        }
    }


    layersArr.forEach(function (item, index) {
        if (index == 0) {

        }
        PowerPlant.searchDevice(item, layersArr[index].name);
    });

    // PowerPlant.searchDevice();
};

//单图层搜索设备
PowerPlant.searchDevice = function (deviceLayer, name) {
    // var deviceLayer = PowerPlant._getLayerByName("设备");
    //alert(deviceLayer.LayerType+":"+deviceLayer.Name);
    if (deviceLayer.LayerType.toLowerCase() != 'model') {
        return
    }
    var lonLatRect = deviceLayer.LonLatRect;
    var lng = (lonLatRect.East + lonLatRect.West) / 2;
    var alt = (lonLatRect.North + lonLatRect.South) / 2;
    var param = {
        lng: lng,
        lat: alt,
        radius: 200
    };
    var searchCircle = PowerPlant._getCircleVectors(param);

    if (deviceLayer === undefined || deviceLayer == null)
        return;
    var searchParam = deviceLayer.LocalSearchParameter;//搜索接口
    if (searchParam == null) {
        return;
    }
    searchParam.ClearSpatialFilter();
    if (searchParam == null) {
        return null;
    }

    searchParam.SetFilter("", "");//参数 关键字 ID
    searchParam.SetSpatialFilter(searchCircle);//查询空间范围

    searchParam.PageRecordCount = 10000;//最多搜索条数
    searchParam.HasDetail = true;//完整字段信息
    searchParam.HasMesh = true;
    var origType = searchParam.ReturnDataType;
    searchParam.ReturnDataType = 1;//0所有数据， 1 xml数据，  2.渲染数据
    deviceLayer.ClearSearchResult();//清除空间阈值
    var searchResult = deviceLayer.SearchFromLocal();//获取搜索结果
    searchParam.ReturnDataType = origType;
    // alert('if result');
    if (searchResult == undefined || searchResult == null || searchResult.RecordCount == 0) {
        return;
    }
    PowerPlant.showAllSearchDevice(searchResult, name);
};

//获取图层内所有设备
PowerPlant.showAllSearchDevice = function (searchResult, name) {
    //alert(searchResult.RecordCount);
    // for (var i = 0; i < searchResult.RecordCount; i++) {
    //     var deviceObj = searchResult.GetLocalObject(i);
    //     var attraData = deviceObj.GetKey();
    //     PowerPlant.highlightObject(deviceObj);
    // }
    var searchObj = searchResult.GotoPage(0);
    // alert(searchObj);
    var result = JSON.stringify($.xml2json(searchObj));
    var aR = JSON.parse(result);
    var data = aR.SearchResult.ModelResult.ModelData;
    if (data.length) {
        data.forEach(function (item, index) {
            // var parentName;
            // if( !name ){
            //     parentName = '设备'
            // }else{
            //     parentName = name;
            // };
            // alert(parentName);
            var localtionArr = item.LonLatBox.split(',');
            var lng = (parseFloat(localtionArr[2]) + parseFloat(localtionArr[3])) / 2;
            var lat = (parseFloat(localtionArr[0]) + parseFloat(localtionArr[1])) / 2;
            var alt = (parseFloat(localtionArr[4]) + parseFloat(localtionArr[5])) / 2;
            var newId;
            if( item.SE_NAME.toUpperCase().indexOf("_S") != -1 ){
                var idArr = item.SE_NAME.toUpperCase().split('_S');
                //alert(idArr.length);
                newId = idArr[0]+"-M0"+idArr[1];
            }else{
                newId = item.SE_NAME.toUpperCase();
            };
            PowerPlant.device.push(
                {
                    id: newId,
                    status: "运行",
                    level: "一类设备",
                    pic: "",
                    picDept: "",
                    lng: lng,
                    lat: lat,
                    alt: alt,
                    // partent:name,
                    // model:searchResult.GetLocalObject(index)
                }
            );
        });
    } else {
        var localtionArr = data.LonLatBox.split(',');
        var lng = (parseFloat(localtionArr[2]) + parseFloat(localtionArr[3])) / 2;
        var lat = (parseFloat(localtionArr[0]) + parseFloat(localtionArr[1])) / 2;
        var alt = (parseFloat(localtionArr[4]) + parseFloat(localtionArr[5])) / 2;
        var newId;
        if( data.SE_NAME.toUpperCase().indexOf("_S") != -1 ){
            var idArr = data.SE_NAME.toUpperCase().split('_S');
            newId = idArr[0]+"-M0"+idArr[1];
        }else{
            newId = data.SE_NAME.toUpperCase();
        };
        PowerPlant.device.push(
            {
                id: newId,
                status: "运行",
                level: "一类设备",
                pic: "",
                picDept: "",
                lng: lng,
                lat: lat,
                alt: alt,
                // partent:name,
                // model:searchResult.GetLocalObject(index)
            }
        );
    }
    // alert(result);
    // alert(data[0].SE_ID);
    // PowerPlant.stopHighlightObjects();
    // var obj = LayerManagement.earth.LayerManager.GetObjByGuid('a7611444-87de-4397-b8af-c9ce874e03ae');
    // PowerPlant.highlightObject(obj);
    // for (var key in data[0]) {
    //     // alert(obj == null);
    //     alert(key+":"+data[0][key]);
    // }
    //data信息：1.SE_NAME 2.LonLatBox(位置信息) 3.SE_ID 4.name(与1相同) 5.ParentLayer
};

//显示设备树结
PowerPlant.showAllDeviceTree = function (data) {
    var treeNodes = {
        "name": "设备总览",
        "nodes": []
    };
    var treeRoot = {
        "id": "device",
        "name": "设备",
        "desc": "dev1",
        "children": []
    };
    treeNodes.nodes.push(treeRoot);
    var nodeMap = {};
    data.forEach(function (item) {
        nodeMap[item.id] = item;
    });
    var deviceData = data;
    if (deviceData != undefined && deviceData != null) {
        for (var i = 0, l = deviceData.length; i < l; i++) {
            var devInfo = deviceData[i];
            var parentID = devInfo.p_id;

            if (parentID != undefined && parentID != "") {
                var parentNode = nodeMap[parentID];
                if (parentNode == undefined || parentNode == null) {
                    alert("设备 " + parentID + " 的父设备不存在");
                } else {
                    if (parentNode.children == undefined) {
                        parentNode.children = [];
                    }
                    parentNode.children.push(devInfo);
                }
            } else {
                treeRoot.children.push(devInfo);
            }
        }
    }
    PowerPlant.deviceTreeNodes = treeNodes;
};


//leftPanel方案
// PowerPlant.showPropertyTree = function(treeNodes) {
//     bLayerVisible = false;
//     closeDialog();
//     $("#menuTree").html();
//     $("#leftPanel").show();
//     $(".layerHeaderInnerText").html(treeNodes["name"]);
//     $("#id_tree_body").hide();
//     $("#id_menu_body").show();
//     $("#mainEarth").css("margin-left", "350px");
//     $("#id_menu_body").height($("#id_left_layerTree").height() - $("#layerHeader").height() - $("#layer_title").height());
//
//     var scrollOrder = ""; //隐藏div的时候将其中的自定义的滚动条去掉,不然会影响性能
//     $("#id_menu_body").mCustomScrollbar(scrollOrder);
//     //setToolsIconStatus();
//     var nodes = treeNodes["nodes"];
//
//     var tree = $.fn.zTree.init($("#menuTree"), PowerPlant.treeSetting, nodes);
// };


//阻止惯性旋转
// setTimeout(function(){
//     seearth.Environment.EnableMouseMoveMessage = true;
//     seearth.Event.OnMBDown = function(){
//         // alert(1);
//         seearth.Event.OnMouseMove = function () {
//             setTimeout(function () {
//                 seearth.GlobeObserver.Stop();
//             },1500)
//         }
//     };
// },500

//js写入本地文件
setTimeout(function () {
    //file();
}, 10000);

function file() {

    var fso;
    try {
        fso = new ActiveXObject("Scripting.FileSystemObject");
    } catch (e) {
        alert("当前浏览器不支持");
        return;
    }

    alert("方法已执行2");
    var f1 = fso.createtextfile("D:\\2.txt", true);
    f1.write(JSON.stringify(PowerPlant.device, null, "\t"));
    var openf1 = fso.OpenTextFile("2.txt");

    str = openf1.ReadLine();
    alert("里面的内容为'" + str + "'");
};





