/**
 * 作       者：sn
 * 创建日期：2019年1月19日
 * 描        述：电厂三维项目接口
 * 注意事项：
 * 遗留bug：0
 * 修改日期：2019年1月19日
 ******************************************/

/**
 * 电厂相关信息
 *
 */
var PowerPlant = {
    //气泡弹窗
    pickObjParent: null,
    htmlBalloon: null,
    //tree气泡
    treeBalloon:null,
    treeDetailBalloon:null,
    propertyDiv: undefined,
    highLightObjects: [],
    cameraLayer: null,
    elementCamera: null,
    iconObjects: {},
    index: 0,
    iconPaths: {},
    balloonWidth: 400,
    balloonHeight: 260,
    treeSetting: undefined,
    treeNodeData: undefined,
    propertyTree: undefined,
    imgWidth: 845, 	//图片弹窗的大小
    imgHeight: 415,
    widthcamera: 438,
    heightcamera: 360,
    imgPosition: {},
    //1.属性 2.视频监控
    cameraIp: [
        70,
        69,
        34,
        104,
        169,
        167,
        124,
        107,
        132,
        47,
        46,
        32,
        43,
        65,
        111,
        90,
        115,
        54,
        128,
        159,
        38,
        82,
        86,
        100,
        116,
        158,
        160,
        48,
        99,
        96,
        109,
        55,
        63,
        72,
        50,
        101,
        137,
        94,
        40,
        74,
        75,
        117,
        112,
        126,
        80,
        134,
        44,
        36,
        157,
        71,
        119,
        30,
        59,
        102,
        136,
        49,
        95,
        68,
        130,
        64,
        85,
        152,
        62,
        151,
        88,
        56,
        125,
        146,
        149,
        41,
        58,
        97,
        39,
        129,
        114,
        144,
        143,
        35,
        108,
        120,
        103,
        147,
        76,
        78,
        77,
        37,
        83,
        52,
        142,
        141,
        61,
        45,
        84,
        57,
        91,
        81,
        33,
        148,
        118,
        133,
        42
    ],
    cameraIcon: null,
    cameraExist: [
        5,
        6,
        7,
        9,
        10,
        11,
        12,
        13,
        15,
        16,
        17,
        20,
        21,
        24,
        25,
        31,
        32,
        33,
        34,
        35,
        36,
        39,
        40,
        46,
        49,
        52,
        53,
        56,
        57,
        59,
        63,
        64,
        66,
        67,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        84,
        85,
        87,
        88,
        89,
        90,
        94,
        95,
        96,
        98,
        99,
        100,
        101,
        102,
        103,
        104,
        105,
        107,
        110,
        111,
        112,
        113,
        116,
        118,
        119,
        121,
        124,
        125,
        126,
        130,
        133,
        134,
        143,
        146,
        147,
        148,
        153,
        154,
        155,
        158,
        162,
        163,
        164,
        168,
        173,
        174,
        175,
        179,
        180,
        182,
        183,
        184,
        187,
        188,
        193,
        194,
        197,
        198,
        199,
        203
    ],
    staLocaltion: [ //统计信息
        {
            name: '1#',
            lng: 109.414075,
            lat: 38.034099,
            lta: 1201.99
        },
        {
            name: '2#',
            lng: 109.414040,
            lat: 38.033089,
            lta: 1202.09
        },
    ],
    //存放发电房
    staBalloons: [],
    //存放冷凝塔
    condBalloons: [],
    accessHtmlBallon: null,
    cameraInClick: false,
    cameraOutClick: false,
    //保存运动物体
    dynamic: null,
    wanderClicked: false,
    //报警hash值
    hash:''
};


PowerPlant.keyNameMap = {
    "defect": {
        "id": "缺陷编码",
        "desc": "缺陷描述",
        "startTime": "开始时间",
        "endTime": "结束时间",
        "handleDept": "第一责任部门",
        "detectDept": "发现部门",
        "detectPerson": "缺陷发现人员"
    },
    "device": {
        "id": "设备编码",
        "name": "设备名称",
        "status": "运行状态",
        "level": "设备等级",
        "pic": "第一责任人",
        "picDept": "第一责任部门"
    },
    "access": {
        "status": "门禁状态",
        "addr": "门禁位置",
        "count": "刷卡人数"
    },
    "accessDetail": {
        "name": "姓名",
        "time": "时间"
    }
};

PowerPlant.getKeyName = function (type, key) {
    var typeKey = PowerPlant.keyNameMap[type];
    if (typeKey == undefined) return undefined;
    return typeKey[key];
}

PowerPlant.getFullUrl = function (url) {
    return window.location.href.substring(0, window.location.href.lastIndexOf('/')) + url;
}


/**
 * 初始化电厂相关设置
 *
 * @memberof PowerPlant
 *
 * @type
 */
PowerPlant.Init = function () {
    //PowerPlant.initCameraIcon();
    //PowerPlant.initSearchIcon();
    PowerPlant.InitTree();
    PowerPlant.setPowerPlantQuery();
    setTimeout(function () {
        PowerPlant.showAllCamera();
        PowerPlant.showAllWorkCamera();
    },10000)
};

/**
 * 设置电厂属性查询
 *
 * @memberof PowerPlant
 *
 * @type
 */
PowerPlant.setPowerPlantQuery = function () {
    var earth = seearth;
    earth.Environment.SetCursorStyle(32512);
    earth.Event.OnPickObjectEx = PowerPlant.objectPickedEx; //获取的为网络的数据
    earth.Event.OnPickObject = PowerPlant.objectPicked;
    earth.Event.OnRBDown = function (pos) {
        function _onrbd(pos) {
            earth.Event.OnRBUp = function (pos) {
                earth.Event.OnRBDown = function (pos) {
                    _onrbd(pos);
                };
            };
            earth.Query.PickObject(511, pos.x, pos.y);
        }
        _onrbd(pos);
    };
};

/*
* 关闭电厂属性查询
*
* */
PowerPlant.closePowerPlantQuery = function(){
    var earth = seearth;
    earth.Environment.SetCursorStyle(32512);
    earth.Event.OnPickObjectEx = function(){};
    earth.Event.OnPickObject = PowerPlant.objectPicked;
    earth.Event.OnRBDown = function (pos) {
        function _onrbd(pos) {
            earth.Event.OnRBUp = function (pos) {
                earth.Event.OnRBDown = function (pos) {
                    _onrbd(pos);
                };
            };
            earth.Query.PickObject(511, pos.x, pos.y);
        }
        _onrbd(pos);
    };
};

/**
 * 初始化左侧树结构
 *
 * @memberof PowerPlant
 *
 * @type
 */
PowerPlant.InitTree = function () {
    var setting = {
        check: {
            enable: false, //是否显示checkbox或radio
            chkStyle: "checkbox" //显示类型,可设置(checbox,radio)
        },
        view: {
            dblClickExpand: true, //双击节点时，是否自动展开父节点的标识
            expandSpeed: "", //节点展开、折叠时的动画速度, 可设置("","slow", "normal", or "fast")
            selectedMulti: false, //设置是否允许同时选中多个节点
            showIcon: false
        },
        callback: {
            onClick: function (event, treeId, node) {
            },
            onDblClick: function (event, treeId, node) { //双击图层
                //设备信息联动
                if (node && node.lng) {

                    // cameraShow.forEach(function (item,index) {//关闭摄像机图标
                    // 	item.label.Visibility = false;
                    // });
                    // cameraShow = [];
                    PowerPlant.closeHtmlBalloon();
                    //todo 添加物体闪烁
                    earth.GlobeObserver.FlytoLookat(node.lng, node.lat, node.alt, 0.0, 30, 0.0, 3, 3);

                    setTimeout(function () {
                        if(node.status != null){
                            var objProperties = {
                                attributes:{
                                    SE_NAME:node.id
                                },
                                position:{
                                    lng:node.lng,
                                    lat:node.lat,
                                    alt:node.alt
                                }
                            };
                            PowerPlant.showDeviceInfo(null,objProperties);
                            PowerPlant.highlightSearchDevice(node);
                        }
                        //摄像机图层
                        // if (node.cameraArray) {
                        //     node.cameraArray.forEach(function (item, index) {
                        //         for (var key in PowerPlant.iconObjects) {
                        //             if (PowerPlant.iconObjects[key].index == item) {
                        //                 PowerPlant.iconObjects[key].label.Visibility = true;
                        //                 //alert(item);
                        //                 cameraShow.push(PowerPlant.iconObjects[key]);
                        //             }
                        //         }
                        //     })
                        // }
                    }, 3000)
                }

                //摄像视频调用
                if( node && node.ip ){
                    PowerPlant.showHikVideo(node);
                }

                PowerPlant.treeDblClicked(node);
            },
            onCheck: function (event, treeId, node) { //点击checkbox事件
            }
        }
    };
    PowerPlant.treeSetting = setting;
}

PowerPlant.treeDblClicked = function (node) {
    if (node) {
        if (node.type == "sis") {
            PowerPlant.showSisInfo(node);
        } else if (node.type == "defect") {
            PowerPlant.showDefectInfo(node);
        } else if (node.type == "device") {
            var objProperties = {};
            PowerPlant.showDeviceCard(objProperties);
        }
    }
}

PowerPlant.createHtmlBalloon = function (guid, name) {
    var htmlBalloon = earth.Factory.CreateHtmlBalloon(guid, name);
    htmlBalloon.SetTailColor(parseInt("0xffffff00"));
    htmlBalloon.SetIsAddCloseButton(true);
    htmlBalloon.SetIsAddMargin(false);
    htmlBalloon.SetIsAddBackgroundImage(true);
    htmlBalloon.SetIsTransparence(false);
    htmlBalloon.SetBackgroundRGB(0xEDEDED);
    htmlBalloon.SetBackgroundAlpha(255);
    return htmlBalloon;
}

PowerPlant.setDetailContents = function (data) {
    //alert("setDetailContents");
    var propertyHtml = "";
    if (data.length < 1) {
        propertyHtml += '<p class="noInfo">无缺陷信息</p>';
    } else {
        propertyHtml = "<ul>";
        propertyHtml += " <li class=\"detailTitle\">\n" +
            "                        <p class=\"number\">缺陷编码</p>\n" +
            "                        <p class=\"detail\">缺陷描述</p>\n" +
            "                        <p class=\"start\">开始时间</p>\n" +
            "                        <p class=\"end\">结束时间</p>\n" +
            "                        <p class=\"department\">第一责任部门</p>\n" +
            "                        <p class=\"find\">发现部门</p>\n" +
            "                        <p class=\"people\">缺陷发现人员</p>\n" +
            "                    </li>";
        data.forEach(function (item) {
            propertyHtml += '<li class="detailContent">';
            propertyHtml += '<p class="number">' + item.sqxbh + '</p>';
            propertyHtml += '<p class="detail">' + item.sgzxxsm + '</p>';
            propertyHtml += '<p class="start">' + item.ssjkssj + '</p>';
            propertyHtml += '<p class="end">' + item.ssjjssj + '</p>';
            propertyHtml += '<p class="department">' + item.ssbzzrbm + '</p>';
            propertyHtml += '<p class="find">' + item.sfxrssbmName + '</p>';
            propertyHtml += '<p class="people">' + item.sfxr + '</p>';
            propertyHtml += '</li>';
        });
        propertyHtml += '</ul>';
    }
    PowerPlant.propertyHtml = propertyHtml;
    var propertyDiv = PowerPlant.propertyDiv.find(".mis");
    propertyDiv.html(propertyHtml);
    PowerPlant.propertyDiv.mCustomScrollbar({
        /*theme: "minimal",
        scrollInertia:550*/
    });
}

PowerPlant.showDefectInfo = function (node) {
    //alert("showDefectInfo");
    $.ajax({
        type: "GET",
        url: "http://10.2.1.25:8081/imis/bs/getDefectListByEqCode",
        data: {code: node.num},
        // dataType: "json",
        // contentType:"application/json",
        success: function (data) {
            var defectData = data.data.defects;
            var rect = {
                width: 1250,
                height: 290
            }
            PowerPlant.showDetailBalloon(defectData, rect);
        },
        error: function (e) {
            console.log(e);
        }
    });
    // var jsonUrl = PowerPlant.getFullUrl("/json/defect.json");
    // $.getJSON(jsonUrl, function(jsonData){
    // 	jsonData.infoType = "defect";
    // 	var rect = {
    // 		width: 1260,
    // 		height: 300
    // 	}
    // 	PowerPlant.showDetailBalloon(jsonData, rect);
    // })
}

PowerPlant.showDetailBalloon = function (data, rect, pos) {
    //alert("showDetailBalloon");
    PowerPlant.closeHtmlBalloon();

    var guid = earth.Factory.CreateGuid();
    var htmlBalloon = PowerPlant.createHtmlBalloon(guid, "URL气泡");
    htmlBalloon.SetRectSize(rect.width, rect.height);

    var wW = window.innerWidth;
    var wH = window.innerHeight;
    var left = wW > 1250 ? wW / 2 : 0;
    var top = wH > 290 ? wH / 2 : 0;
    // alert(left+","+top);
    //var pos = objProperties.position;
    if (pos != undefined) {
        htmlBalloon.SetSphericalLocation(pos.lng, pos.lat, pos.alt);
    } else {
        htmlBalloon.SetScreenLocation(left, top);
    }

    earth.Event.OnDocumentReadyCompleted = function (guid) {//气泡加载完成事件
        if (guid == htmlBalloon.guid) {
            PowerPlant.setBalloonParameters();
            PowerPlant.setDetailContents(data);
        }
    };
    var url = PowerPlant.getFullUrl('/html/query/mis.html');
    PowerPlant.htmlBalloon = htmlBalloon;
    htmlBalloon.ShowNavigate(url);
};

//图片弹窗
PowerPlant.showSisInfo = function (node) {
    PowerPlant.closeHtmlBalloon();
    var wW = window.innerWidth;
    var wH = window.innerHeight;
    var guid = LayerManagement.earth.Factory.CreateGuid();
    var htmlBalloon = PowerPlant.createHtmlBalloon(guid, '功能菜单');
    htmlBalloon.SetScreenLocation(wW / 2, 200);
    htmlBalloon.SetRectSize(1220, 635);
    LayerManagement.earth.Event.OnDocumentReadyCompleted = function (guid) {
        if (guid == htmlBalloon.guid) {
            PowerPlant.link = node.link;
            PowerPlant.setBalloonParameters();
        }
    }
    PowerPlant.htmlBalloon = htmlBalloon;
    htmlBalloon.ShowNavigate(PowerPlant.getFullUrl('/html/query/sis.html'));
    // htmlBalloon.ShowNavigate(node.link);
}

PowerPlant.closeHtmlBalloon = function () {
    // alert(PowerPlant.htmlBalloon != undefined);
    if (PowerPlant.htmlBalloon != undefined) {
        PowerPlant.htmlBalloon.DestroyObject();
        PowerPlant.htmlBalloon = undefined;
    }
}

/**
 * 拾取本地创建对象
 * @param pickedObject  拾取对象
 */
PowerPlant.objectPicked = function (pickedObject) {
    if (pickedObject == null) {
        alert("对象不存在");
        return;
    }
    var iconObj = PowerPlant.iconObjects[pickedObject.Guid];
    if (iconObj === undefined) return;
    if (iconObj.type == "camerain" || iconObj.type == "cameraout") {
        for (var key in iconObj) {
            // alert(key+":"+iconObj[key]);
        }
        var labelObj = iconObj.obj;
        if (labelObj != undefined) {
            var objProperties = {};
            //方案3 hikVideo方案（后端插件+画面卡顿）
            if (iconObj.ip) {
                PowerPlant.getObjectPosition(labelObj, objProperties);
                PowerPlant.showCameraBalloon(objProperties, iconObj.ip, null);
            } else {
                objProperties = labelObj;
                PowerPlant.showCameraBalloon(objProperties, "", labelObj);
            }


            //方案2 VLC方案（后端插件+画面卡顿）
            // PowerPlant.showCameraBalloon(objProperties,iconObj.id);


            //方案1 VS方案（无法获取到视频）
            // PowerPlant.showCameraVideo(objProperties,iconObj.id);
        }
    } else if (iconObj.type == "access") {
        var labelObj = iconObj.obj;
        if (labelObj != undefined) {
            var objProperties = {};
            PowerPlant.getObjectPosition(pickedObject, objProperties);
            objProperties.attributes = labelObj;
            objProperties.infoType = "access";
            PowerPlant.showPropertyBalloon(objProperties);
        }
    }
}

/**
 * 获取拾取对象的属性信息
 * @param {Object} pickedObject  拾取的对象
 * @param {Object} objProperties  保存对象属性信息
 *
 */
PowerPlant.getObjectProperties = function (pickedObject, objProperties) {
    //alert("get object property");
    var poiLayers = LayerManagement.POILAYERS; //POI图层
    var objLayer;
    if (pickedObject.ParentGuid !== undefined) {
        for (var i = 0; i < poiLayers.length; i++) {
            if (pickedObject.ParentGuid == poiLayers[i].name) {
                objProperties.layerType = "poi";
                //objProperties.objType = poiLayers[i].name;
                objProperties.parentLayerID = poiLayers[i].id;
            }
        }
    }
    if (objProperties.layerType === undefined) {
        // 非POI图层
        pickedObject.Underground = true;
        //pickedObject.ShowHighLight();
        var parentLayerID = pickedObject.GetParentLayerName();
        if (parentLayerID == "" || parentLayerID == null) {
            alert("获得父层名称失败！");
            return false;
        }

        parentLayerID = parentLayerID.split("=")[1];
        parentLayerID = parentLayerID.split("_")[0];
        objProperties.parentLayerID = parentLayerID;
    }

    objLayer = earth.LayerManager.GetLayerByGUID(objProperties.parentLayerID);
    objProperties.objType = objLayer.Name;

    var searchResult = objLayer.SearchResultFromLocal;
    var attrData = PowerPlant.parseSearchResult(searchResult);
    if (attrData != null && $.isArray(attrData)) {
        attrData = attrData[0];
    }
    objProperties.attributes = attrData;
}

PowerPlant.parseSearchResult = function (searchResult) {
    var attrXml = searchResult.GotoPage(0);
    var attrData = $.xml2json(attrXml);
    //alert(JSON.stringify(attrData));
    if (attrData.SearchResult != null && attrData.SearchResult.total > 0) {
        if (attrData.SearchResult.POIResult != null) {
            attrData = attrData.SearchResult.POIResult.POIData;
        } else {
            if (attrData.SearchResult.ModelResult != null) {
                attrData = attrData.SearchResult.ModelResult.ModelData;
            } else if (attrData.SearchResult.VectorResult != null) {
                attrData = attrData.SearchResult.VectorResult.VectorData;
            }
        }
        return attrData;
    } else {
        return null;
    }
}

PowerPlant.getObjectPosition = function (pickedObject, objProperties) {
    var lng = pickedObject.Longitude;
    var lat = pickedObject.Latitude;
    var alt = pickedObject.Altitude;
    if (lng == undefined || lat == undefined || alt == undefined) {
        var rect = pickedObject.GetLonLatRect();
        lng = (rect.East + rect.West) / 2;
        lat = (rect.North + rect.South) / 2;
        alt = (rect.MaxHeight + rect.MinHeight) / 2;
    }
    ;
    objProperties.position = {
        lng: lng,
        lat: lat,
        alt: alt
    };
}

/**
 * 拾取对象回调
 * @param {Object} pickedObject  拾取的对象
 *
 * 添加了搜索父图层
 *
 */

PowerPlant.objectPickedEx = function (pickedObject) {
    //var earth = seearth;
    if (pickedObject == null) {
        alert("对象不存在");
        return;
    }
    if (!$.isEmptyObject(PowerPlant.iconObjects)) { //图标隐藏
        for (var key in PowerPlant.iconObjects) {
            PowerPlant.iconObjects[key].label.Visibility = false;
        }
    }
    ;
    PowerPlant.closePropertyTree();
    var objProperties = {};
    var layerManager = STAMP.LayerManager(earth);
    PowerPlant.pickObjLayer = pickedObject.GetParentLayerName();
    //获取可操作图层id
    var layer = earth.LayerManager.GetLayerByGUID(getLayer(PowerPlant.pickObjLayer));

    function getLayer(layerid) {
        var cArr = layerid.split("=");
        var cArr1 = cArr[1].split("_");
        return cArr1[0];
    }

    // sAc(layer);
    function sAc(layer) {//关闭图层并显示点击对象图层
        function getParent(layer) {
            var parent = null;
            for (var i = 0, length = LayerManagement.groupLayers.length; i < length; i++) {
                if (layer.Guid == LayerManagement.groupLayers[i].id) {
                    parent = LayerManagement.groupLayers[i].parent;
                }
            }
            ;
            return parent;
        };
        var parentLayer = getParent(layer);
        for (var i = 0, length = LayerManagement.groupLayers.length; i < length; i++) {
            if (LayerManagement.groupLayers[i].parent == parentLayer) {
                var layerObj = earth.LayerManager.GetLayerByGUID(LayerManagement.groupLayers[i].id);
                layerObj.Visibility = layerObj.checked;

            }
        }
        ;
        if (layer.LayerType) {
            layer.Visibility = true;
            layerManager.flyToLayer(layer); //定位图层
        }
        ;
    }

    // alert(LayerManagement.groupLayers[0].id);

    // PowerPlant.highlightObject(pickedObject);
    PowerPlant.getObjectPosition(pickedObject, objProperties);
    PowerPlant.getObjectProperties(pickedObject, objProperties);
    var objType = PowerPlant.getObjectType(objProperties);
    //alert(objType);
    if (objType == "Device") {
        PowerPlant.showDeviceInfo(pickedObject, objProperties);
        pickedObject.ShowHighLight();
    } else if (objType.type == "Building") {
        PowerPlant.showBuildingInfo(pickedObject, objProperties, objType.value);
    } else if (objType == "Road") {
        PowerPlant.showRoadInfo(pickedObject, objProperties);
    } else {
        return;
    }
    //pickedObject.ShowHighLight();
    // PowerPlant.highlightObject(pickedObject);
};

PowerPlant.getObjectType = function (objProperties) {
    var objInfo = objProperties.attributes;
    if (objInfo === undefined || objInfo == null) {
        return undefined;
    }

    //alert(objInfo['ParentLayer']);  //ParentLayer
    // alert(objInfo['SE_NAME']);
    var pattern = /^[a-zA-Z0-9]{10,}/;
    if (pattern.test(objInfo['SE_NAME'])) { //设备
        return 'Device';
    }
    var buildArr = [
        {
            model: 'bgl',
            value: 'BGL'
        },
        {
            model: 'hyl',
            value: 'HYL'
        },
        {
            model: 'rlgk',
            value: 'RLGKL'
        },
        {
            model: 'sbwhc',
            value: 'LJQ'
        },
        {
            model: 'qjf',
            value: 'JKL'
        },
        {
            model: 'jz_006',
            value: 'SMZHL'
        },
        {
            model: 'sltsl',
            value: 'TLDKL'
        },
    ];
    for (var key in buildArr) {
        if (objInfo['SE_NAME'].indexOf(buildArr[key].model) != -1) {//判断模型类型 返回请求参数
            //alert(key+","+buildArr[key].value);
            return {
                type: 'Building',
                value: buildArr[key].value
            };
        }
    }
    var objType = objInfo['SE_NAME'].substring(0, 2);
    if (objType === undefined || objType == null) {
        return undefined;
    }
    if (objType == 'jk') {
        return 'Camera';
    } else {
        return undefined;
    }
}

PowerPlant.getCameraNodes = function (objProperties, treeNodes, radius) {
    var pos = objProperties.position;
    var param = {
        lng: pos.lng,
        lat: pos.lat,
        radius: radius
    }
    var cameraResult = PowerPlant.searchCamera(param);
    if (cameraResult == undefined || cameraResult == null) {
        return;
    }
    var cameraNodes = {
        "id": "Camera",
        "name": "监控",
        "title": "监控",
        children: [],
    };
    var searchData = PowerPlant.parseSearchResult(cameraResult);
    if (searchData == undefined || searchData == null) {
        return;
    }
    var treeData = {};
    for (var i = 0; i < searchData.length; i++) {
        var camearInfo = searchData[i];
        var cameraObj = cameraResult.GetLocalObject(i);
        var cameraProperties = {};
        PowerPlant.getObjectPosition(cameraObj, cameraProperties);
        cameraProperties.attributes = camearInfo;
        var node = {
            id: cameraObj.Guid,
            name: '摄像机' + camearInfo["SE_NAME"],
            obj: cameraObj,
            property: cameraProperties
        };
        treeData[cameraObj.Guid] = node;
        cameraNodes.children.push(node);
    }
    treeNodes.push(cameraNodes);
    PowerPlant.treeNodeData = treeData;
}

//设备SIS系统树
PowerPlant.getDeviceInfoNodes = function (pickedObject, objProperties, data) {
    var treeNodes = {
        "name": "设备详情",
        "nodes": [{
            "id": data.sfwz,
            "name": data.ssbmc,
            "desc": "dev1",
            children: [
                {
                    "id": "SIS",
                    "name": "SIS",
                    "desc": "SIS",
                    children: []
                },
                {
                    "id": "MIS",
                    "name": "MIS",
                    "desc": "MIS",
                    children: [
                        {
                            "id": "mis1",
                            "type": "defect",
                            "name": "设备缺陷",
                            "num": data.ssbbm
                        }
                    ]
                }
            ]
        },
        ]
    };
    if (data.id) { //todo
        sisList.forEach(function (item, index) {
            if (data.id.toUpperCase() == item.id) {
                treeNodes.nodes[0].children[0].children.push(
                    {	//todo sis
                        "id": "sis1",
                        "type": "sis",
                        "name": item.sisName,
                        "link": item.link
                    }
                )
            }
        })
    }
    ;
    //PowerPlant.getCameraNodes(objProperties, treeNodes, 40);
    PowerPlant.sisTreeNodes = treeNodes;
};

PowerPlant._getBuildingType = function (name) {
    if (name == "jz_008") {
        return "office";
    } else if (name == "jz_013") {
        return "controlCenter";
    } else if (name == "jz_011") {
        return "operatingRoom";
    } else if (name == "jz_010") {
        return "controlroom";
    } else if (name.indexOf('ssl') != -1) {
        return 'office';
    } else {
        return null;
    }
}

PowerPlant._getBuildingName = function (name) {
    if (name == "jz_013") {
        return "办公大楼";
    } else if (name == "jz_008") {
        return "控制中心";
    } else if (name == "jz_011") {
        return "操作室";
    } else if (name == "jz_010") {
        return "控制室";
    } else {
        return null;
    }
}

PowerPlant.getAccessControlInfo = function (objType) {
    return PowerPlant.accessControl[objType];
}

PowerPlant.getFireControlPosition = function (objType) {
    return PowerPlant.fireControl[objType];
}

PowerPlant.getRoadTreeNodes = function (pickedObject, objProperties) {
    var treeNodes = [];

    PowerPlant.getCameraNodes(objProperties, treeNodes, 400);
    return treeNodes;
};

PowerPlant.showDeviceInfo = function (pickedObject, objProperties) {
    var id = objProperties.attributes.SE_NAME;
    if (id.toUpperCase().indexOf("_S") != -1) {
        var idArr = id.toUpperCase().split('_S');
        id = idArr[0] + "-M0" + idArr[1];
    }
    var deviceData;
    var treeNodes;
    $.ajax({
        type: "GET",
        url: "http://10.2.1.25:8081/imis/bs/getEquipment",
        data: {code: id},
        // dataType: "json",
        // contentType:"application/json",
        success: function (data) {
            deviceData = data.data.equipments[0];
            deviceData.id = id;
            PowerPlant.showDeviceCard(objProperties, deviceData);
            //显示SIS MIS系统点选设备数
            PowerPlant.getDeviceInfoNodes(pickedObject, objProperties, deviceData);
            setTimeout(function () {//todo 将设备详情移至右端显示
                PowerPlant.showDetailTreeBallon(PowerPlant.sisTreeNodes);
            }, 200);
        },
        error: function (e) {
            alert("服务器错误");
        }
    });
    var param = {
        lng: objProperties.position.lng,
        lat: objProperties.position.lat,
        radius: 50
    };
    // PowerPlant.searchCamera(param);
};

PowerPlant.showDeviceCard = function (objProperties, data) {
    PowerPlant.showPropertyBalloon(objProperties, data);
    // var jsonUrl = PowerPlant.getFullUrl("/json/device.json");
    // // alert(jsonUrl);
    // $.getJSON(jsonUrl, function(jsonData){
    // 	var deviceInfo = jsonData.devices[jsonData.devices.length - 1];
    // 	objProperties.attributes = deviceInfo;
    // 	objProperties.infoType = "device";
    // 	if (objProperties.position == undefined || objProperties.position == null) {
    // 		var pos = {
    // 			lng: deviceInfo.lng,
    // 			lat: deviceInfo.lat,
    // 			alt: deviceInfo.alt
    // 		};
    // 		objProperties.position = pos;
    // 		earth.GlobeObserver.FlytoLookat(pos.lng, pos.lat, pos.alt, 0.0, 90.0, 0.0, 200, 3);
    // 	}
    // 	PowerPlant.showPropertyBalloon(objProperties);
    // })
};

PowerPlant.showDeviceTree = function () {
    var treeNodes = {
        "name": "设备信息",
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
    var jsonUrl = PowerPlant.getFullUrl("/json/device.json");
    $.getJSON(jsonUrl, function (jsonData) {
        var deviceData = jsonData.devices;
        if (deviceData != undefined && deviceData != null) {
            for (var i = 0, l = deviceData.length; i < l; i++) {
                var devInfo = deviceData[i];
                nodeMap[devInfo.id] = devInfo;
                var parentID = devInfo.parent;

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
        PowerPlant.showPropertyTree(treeNodes);
    });
};

PowerPlant.showAllCamera = function () {
    // alert('run');
    var param = {
        lng: 109.41520282,
        lat: 38.034458264,
        radius: 800
    };
    PowerPlant.searchCamera(param);
};


//关闭门禁信息
PowerPlant.closeAccessHtmlBalloon = function () {
    // alert(PowerPlant.htmlBalloon != undefined);
    if (PowerPlant.accessHtmlBallon != undefined) {
        PowerPlant.accessHtmlBallon.DestroyObject();
        PowerPlant.accessHtmlBallon = undefined;
    }
}

PowerPlant.showBuildingInfo = function (pickedObject, objProperties, value) {//building
    PowerPlant.getObjectProperties(pickedObject, objProperties);
    PowerPlant.closeAccessHtmlBalloon();
    PowerPlant.accessMsg = value;
    var position = objProperties.position;
    var objName = objProperties.attributes["SE_NAME"];
    var objType = PowerPlant._getBuildingType(objName);
    //var treeNodes = PowerPlant.getBuildingTreeNodes(pickedObject, objProperties);
    //PowerPlant.showPropertyTree(treeNodes);
    // PowerPlant.showAccessControl(objType);
    // PowerPlant.showFireControl(objType);
    var balloon = LayerManagement.earth.Factory.CreateHtmlBalloon(LayerManagement.earth.Factory.CreateGuid(), 'access');
    PowerPlant.accessHtmlBallon = balloon;
    balloon.SetRectSize(280, 236);
    balloon.SetSphericalLocation(position.lng, position.lat, position.alt);
    // balloon.SetScreenLocation(500, 500);
    balloon.SetTailColor(parseInt("0xff03132c"));
    balloon.SetIsAddCloseButton(false);
    balloon.SetIsAddMargin(false);
    balloon.SetIsAddBackgroundImage(true);
    balloon.SetIsTransparence(false);
    balloon.SetBackgroundRGB(0xEDEDED);
    balloon.SetBackgroundAlpha(255);
    //balloon.SetBackgroundRGB(0x2167A3);
    var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    var url = windowUrl + '/access.html';
    LayerManagement.earth.Event.OnDocumentReadyCompleted = function (guid) {
        if (guid == balloon.guid) {
            //resizeEarthToolWindow();
            //refreshEarthMenu();
            PowerPlant.setStaBalloonParameters(balloon);
        }
    };
    balloon.ShowNavigate(url);
}

PowerPlant.showAccessControl = function (objName) {
    var accessInfo = PowerPlant.getAccessControlInfo(objName);
    for (var i = 0, l = accessInfo.length; i < l; i++) {
        var pos = accessInfo[i];
        PowerPlant.createIconLabel("access", "icon\\access.png", pos, accessInfo[i]);
    }
}

PowerPlant.showFireControl = function (objName) {
    var posArray = PowerPlant.getFireControlPosition(objName);
    for (var i = 0, l = posArray.length; i < l; i++) {
        var pos = posArray[i];
        PowerPlant.createIconLabel("fire", "icon\\smoke.png", pos);
    }
}

PowerPlant.showRoadInfo = function (pickedObject, objProperties) {
    var treeNodes = PowerPlant.getRoadTreeNodes(pickedObject, objProperties);
    PowerPlant.showPropertyTree(treeNodes);
}

PowerPlant.showPropertyTree = function (treeNodes) {
    bLayerVisible = false;
    closeDialog();
    $("#menuTree").html();
    $("#leftPanel").show();
    $(".layerHeaderInnerText").html(treeNodes["name"]);
    $("#id_tree_body").hide();
    $("#id_menu_body").show();
    $("#mainEarth").css("margin-left", "255px");
    $("#id_menu_body").height($("#id_left_layerTree").height() - $("#layerHeader").height() - $("#layer_title").height());

    var scrollOrder = ""; //隐藏div的时候将其中的自定义的滚动条去掉,不然会影响性能
    $("#id_menu_body").mCustomScrollbar(scrollOrder);
    //setToolsIconStatus();
    var nodes = treeNodes["nodes"];

    var tree = $.fn.zTree.init($("#menuTree"), PowerPlant.treeSetting, nodes);
}

PowerPlant.closePropertyTree = function () {
    bLayerVisible = false;
    closeDialog();
    $("#leftPanel").hide();
    $("#mainEarth").css("margin-left", "0px");
    $("#id_tree_body").mCustomScrollbar("destroy");	//隐藏div的时候将其中的自定义的滚动条去掉,不然会影响性能

    PowerPlant.stopHighlightObjects();
    //PowerPlant.clearIconLabel();   //删除图标
}

//传递数据用
PowerPlant.setBalloonParameters = function () {
    var parameter = {};
    parameter.updatePowerPlantDiv = function (div) {
        PowerPlant.propertyDiv = div;
    };
    parameter.pp = PowerPlant;
    PowerPlant.htmlBalloon.InvokeScript('setParameters', parameter);
};


PowerPlant.setBalloonContents = function (objProperties, data) {
    //alert("setBalloonContents");
    var propertyHtml = '<div class="device">';
    propertyHtml += "<div class='head'><i><img src='" + PowerPlant.getFullUrl('') + "/images/tools/属性查询.png' alt=''></i><p class='title'>属性信息</p><p id='close'>×</p></div>"
    propertyHtml += "<ul>";
    for (var key in data) {
        switch (key) {
            case "ssbbm":
                propertyHtml += '<li>';
                propertyHtml += '<p class="name" >设备编码</p>';
                propertyHtml += '<p class="value" >' + data[key] + '</p>';
                propertyHtml += '</li>';
                propertyHtml += '<li>';
                propertyHtml += '<p class="name" >运行状态</p>';
                propertyHtml += '<p class="value" >运行</p>';
                propertyHtml += '</li>';
                propertyHtml += '<li>';
                propertyHtml += '<p class="name" >设备等级</p>';
                propertyHtml += '<p class="value" >一类设备</p>';
                propertyHtml += '</li>';
                break;
            case "sdyzrrName":
                propertyHtml += '<li>';
                propertyHtml += '<p class="name" >第一责任人</p>';
                propertyHtml += '<p class="value" >' + data[key] + '</p>';
                propertyHtml += '</li>';
                break;
            case "sdyzrrbmName":
                propertyHtml += '<li>';
                propertyHtml += '<p class="name" >第一责任部门</p>';
                propertyHtml += '<p class="value" >' + data[key] + '</p>';
                propertyHtml += '</li>';
                break;
        }
    }

    propertyHtml += '</ul></div>';
    PowerPlant.propertyHtml = propertyHtml;
    var propertyDiv = PowerPlant.propertyDiv.find("#propertyDiv");
    propertyDiv.html(propertyHtml);
    PowerPlant.propertyDiv.mCustomScrollbar({
        /*theme: "minimal",
        scrollInertia:550*/
    });
    if (objProperties.infoType == "access") {
        PowerPlant.setClickCallback(objProperties);
    }
}

PowerPlant.setBalloonVisible = function (isVisible) {
    var htmlBalloon = PowerPlant.htmlBalloon;
    if (htmlBalloon != undefined && htmlBalloon != null) {
        htmlBalloon.setIsVisible(isVisible);
    }
}

PowerPlant.showPropertyBalloon = function (objProperties, data) {
    //alert("showPropertyBalloon");
    // alert(PowerPlant.htmlBalloon != undefined);
    PowerPlant.closeHtmlBalloon();

    var guid = earth.Factory.CreateGuid();
    var htmlBalloon = PowerPlant.createHtmlBalloon(guid, "URL气泡");
    htmlBalloon.SetTailColor(0xff03132c);
    htmlBalloon.SetRectSize(PowerPlant.balloonWidth, PowerPlant.balloonHeight);
    var pos = objProperties.position;
    htmlBalloon.SetSphericalLocation(pos.lng, pos.lat, pos.alt);

    earth.Event.OnDocumentReadyCompleted = function (guid) {//气泡加载完成事件
        if (guid == htmlBalloon.guid) {
            PowerPlant.setBalloonParameters();
            PowerPlant.setBalloonContents(objProperties, data);
        }
    };
    var url = PowerPlant.getFullUrl('/html/query/powerObjProperty.html');
    PowerPlant.htmlBalloon = htmlBalloon;

    htmlBalloon.ShowNavigate(url);
};

PowerPlant._getCircleVectors = function (pos) {
    var vecs = earth.GeometryAlgorithm.CreatePolygonFromCircle(pos.radius, 24);
    var vec3s = earth.Factory.CreateVector3s();
    // alert('CreateVector3s');
    for (var i = 0; i < vecs.Count; i++) {
        earth.GeometryAlgorithm.SetPose(pos.lng, pos.lat, 0, 0, 0, 0, 1, 1, 1);
        var vec = earth.GeometryAlgorithm.TransformCartesionToSphrerical(vecs.Items(i));
        vec3s.Add(vec.X, vec.Y, 0);

    }
    return vec3s;
}

PowerPlant.highlightSearchObjects = function (searchResult) {
    for (var i = 0; i < searchResult.RecordCount; i++) {
        var searchObj = searchResult.GetLocalObject(i);
        PowerPlant.highlightObject(searchObj);
    }
}

PowerPlant.highlightObject = function (obj) {
    obj.ShowHighLight();
    PowerPlant.highLightObjects.push(obj);
}

PowerPlant.stopHighlightObjects = function () {
    for (var i = 0; i < PowerPlant.highLightObjects.length; i++) {
        PowerPlant.highLightObjects[i].StopHighLight();
    }
    PowerPlant.highLightObjects = [];
}

PowerPlant.showCameraBalloon = function (objProperties, ip, obj) {
    //alert("showCameraBalloon");
    if (ip) {
        PowerPlant.nowCameraIp = ip;
        PowerPlant.workCameraProperty = null;
    } else {
        PowerPlant.workCameraProperty = obj;
        PowerPlant.nowCameraIp = "";
    }
    if (objProperties === undefined || objProperties === null) {
        return;
    }

    //测试 阻止窗口
    // return;
    PowerPlant.closeHtmlBalloon();
    // PowerPlant.stopHighlightObjects();
    // PowerPlant.setCameraidParameters(id);

    earth.Event.OnDocumentReadyCompleted = function (guid) {//气泡加载完成事件
        if (guid == htmlBalloon.guid) {
            PowerPlant.setBalloonParameters();
        }
    };
    //alert(JSON.stringify(attrData));
    // var url = PowerPlant.getFullUrl("/html/demo/video1.html");   //vlc方案
    var url = PowerPlant.getFullUrl("/html/demo/hikvideo.html");
    var pos = objProperties.position || objProperties;
    //alert("create Balloon");
    var guid = earth.Factory.CreateGuid();
    var htmlBalloon = PowerPlant.createHtmlBalloon(guid, "URL气泡");
    htmlBalloon.SetTailColor(0xff000000);
    // htmlBalloon.DrawFrameEnable = false;
    // htmlBalloon.ShowFrame = false;
    htmlBalloon.SetRectSize(700, 435);
    htmlBalloon.SetSphericalLocation(pos.lng, pos.lat, pos.alt);
    PowerPlant.htmlBalloon = htmlBalloon;
    htmlBalloon.ShowNavigate(url);
};

PowerPlant.setBalloonVisible = function (isVisible) {
    var htmlBalloon = PowerPlant.htmlBalloon;
    if (htmlBalloon != undefined && htmlBalloon != null) {
        htmlBalloon.SetIsVisible(isVisible);
    }
}

//重置编辑图层
PowerPlant.createCameraLayer = function () {
    var cameraLayer = PowerPlant.cameraLayer;
    if (cameraLayer != undefined && cameraLayer != null) {
        earth.DetachObject(cameraLayer);
        PowerPlant.cameraLayer = null;
    }
    cameraLayer = earth.Factory.CreateEditLayer(earth.Factory.CreateGuid(), "camera_layer",
        earth.Factory.CreateLonLatRect(-90, 90, -180, 180, 0, 10), 0, 10, '');
    earth.AttachObject(cameraLayer);
    PowerPlant.cameraLayer = cameraLayer;
}

/**
 * 显示摄像头视频
 * @argument objProperties 摄像头对象属性
 * @memberof PowerPlant
 *
 */
PowerPlant.showCameraVideo = function (objProperties, id) {
    var postion = objProperties.position;
    var elementCamera = PowerPlant.elementCamera;
    var cameraLayer = PowerPlant.cameraLayer;
    if (elementCamera != undefined && elementCamera != null && cameraLayer != undefined && cameraLayer != null) {
        //清空摄像头
        cameraLayer.DetachWithDeleteObject(elementCamera);
        PowerPlant.elementCamera = null;
    }
    ;
    PowerPlant.createCameraLayer();
    cameraLayer = PowerPlant.cameraLayer;
    if (postion) {
        var guid = earth.Factory.CreateGuid();
        var obj = {}; //摄像机对象
        obj.name = "";
        obj.earth = earth;
        obj.model = "";
        obj.cx = postion.lng;
        obj.cy = postion.lat;
        obj.cz = postion.alt;
        obj.tx = postion.lng;
        obj.ty = postion.lat;
        obj.tz = postion.alt;
        obj.maskUrl = earth.Environment.RootPath + 'res\\mask.png';
        obj.model = earth.Environment.RootPath + 'res\\camera.x';
        if (!obj) {
            return;
        }
        ;
        elementCamera = earth.factory.CreateElementCamera(guid, name || "摄像机", 0, 0);
        elementCamera.SphericalTransform.SetLocationEx(postion.lng, postion.lat, postion.alt);
        if (obj.model) {
            elementCamera.MeshURL = obj.model;
            elementCamera.RtspURL = "rtsp://admin:abc12345@172.168.2.30:554/Stream/Channels/101";
            elementCamera.MaskURL = obj.maskUrl;
            PowerPlant.cameraIp++;
        }
        ;
        if (obj.cx && !isNaN(obj.cx) &&
            obj.cy && !isNaN(obj.cy) &&
            obj.cz && !isNaN(obj.cz) &&
            obj.tx && !isNaN(obj.tx) &&
            obj.ty && !isNaN(obj.ty) &&
            obj.tz && !isNaN(obj.tz)) {

            var v1 = earth.Factory.CreateVector3();
            v1.X = obj.cx;
            v1.Y = obj.cy;
            v1.Z = obj.cz;
            var v2 = earth.Factory.CreateVector3();
            v2.X = obj.tx;
            v2.Y = obj.ty;
            v2.Z = obj.tz;

            elementCamera.SetPoseByLocationAndTarget(v1, v2);
        }
        ;
        elementCamera.EnableFrustum = false;
        elementCamera.Fov = 0;
        cameraLayer.BeginUpdate();
        cameraLayer.AttachObject(elementCamera);
        cameraLayer.EndUpdate();
        PowerPlant.elementCamera = elementCamera;
    }
    ;
    alert(PowerPlant.elementCamera.RtspURL);
    PowerPlant.elementCamera.EnableCameraShot = false;
    PowerPlant.elementCamera.EnableThumbWindow = true;
    PowerPlant.elementCamera.EnableMediaStream = true;
    PowerPlant.elementCamera.UseTCP = false;//UCP模式
};

/**
 * 获取图层对像
 * @argument layerName 图层名称
 * @memberof PowerPlant
 *
 * @return 用于搜索的圆的参数（圆上的顶点坐标）
 */
PowerPlant._getLayerByName = function (layerName) {
    if (layerName == undefined || layerName == null || layerName == "")
        return;
    var resultLayer = undefined;
    var layerList = earth.LayerManager.LayerList;

    function filterChildLayer(layers) {
        if (resultLayer !== undefined) return;
        var childCount = layers.GetChildCount();
        var childLayer;
        for (var i = 0; i < childCount; i++) {
            childLayer = layers.GetChildAt(i);
            if (childLayer.Name == layerName) {
                resultLayer = childLayer;
                break;
            }
            filterChildLayer(childLayer);
        }
    }

    filterChildLayer(layerList);
    return resultLayer;
}

/**
 * 构造圆域搜索中圆的参数
 * @argument param 要搜索的坐标位置经纬度及半径
 * @memberof PowerPlant
 *
 * @return 用于搜索的圆的参数（圆上的顶点坐标）
 */
PowerPlant._getCircleVectors = function (pos) {
    var vecs = earth.GeometryAlgorithm.CreatePolygonFromCircle(pos.radius, 24);
    var vec3s = earth.Factory.CreateVector3s();
    for (var i = 0; i < vecs.Count; i++) {
        earth.GeometryAlgorithm.SetPose(pos.lng, pos.lat, 0, 0, 0, 0, 1, 1, 1);
        var vec = earth.GeometryAlgorithm.TransformCartesionToSphrerical(vecs.Items(i));
        vec3s.Add(vec.X, vec.Y, 0);
    }
    return vec3s;
};

/**
 * 采用圆域搜索的方式，搜索指定坐标经续度和半径的圆内的所有摄像头
 * @argument param 要搜索的坐标位置经纬度及半径
 * @memberof PowerPlant
 *
 */
PowerPlant.searchCamera = function (param) {
    var searchCircle = PowerPlant._getCircleVectors(param);
    // alert('searchCircle');
    cameraLayer = PowerPlant._getLayerByName("摄像头");
    if (cameraLayer == undefined || cameraLayer == null)
        return;
    var searchParam = cameraLayer.LocalSearchParameter;//搜索接口
    if (searchParam == null) {
        return;
    }
    searchParam.ClearSpatialFilter();
    if (searchParam == null) {
        return null;
    }

    searchParam.SetFilter("", "");//参数 关键字 ID
    searchParam.SetSpatialFilter(searchCircle);//查询空间范围

    searchParam.PageRecordCount = 1000;//最多搜索条数
    searchParam.HasDetail = true;//完整字段信息
    searchParam.HasMesh = true;
    var origType = searchParam.ReturnDataType;
    searchParam.ReturnDataType = 1;//0所有数据， 1 xml数据，  2.渲染数据
    cameraLayer.ClearSearchResult();//清除空间阈值
    var searchResult = cameraLayer.SearchFromLocal();//获取搜索结果
    searchParam.ReturnDataType = origType;
    // alert('if result');
    if (searchResult == undefined || searchResult == null || searchResult.RecordCount == 0) {
        return;
    }
    //PowerPlant.highlightObjects(searchResult);
    PowerPlant.showSearchCameraIcon(searchResult);
    // earth.GlobeObserver.FlytoLookat(param.lng, param.lat, 0.0, 0.0, 90.0, 0.0, 200, 3);
}

/**
 * 标注搜索到的摄像头
 *
 * @memberof PowerPlant
 *
 * @return 转换后的图标文件路径
 */
PowerPlant.cameraArr = [];
PowerPlant.showSearchCameraIcon = function (searchResult) {
    // var searchObj = searchResult.GotoPage(0);
    // var result =JSON.stringify($.xml2json(searchObj));
    // var aR = JSON.parse(result);
    // var data = aR.SearchResult.ModelResult.ModelData;
    // data.forEach(function (item,index) {
    // 	// if( index == 2 ){
    // 	// 	for (var key in data[index]) {
    // 	// 		alert(key+":"+data[index][key]);
    // 	// 		//SE_NAME  ynjt_sxtt_169
    // 	// 	}
    // 	// }
    // 	PowerPlant.cameraArr.push(item.SE_NAME);
    // });
    // alert(PowerPlant.cameraArr.length);//205


    for (var i = 0; i < searchResult.RecordCount; i++) {
        // if( PowerPlant.cameraIcon ){
        // 	PowerPlant.cameraIcon.Visibility = false;
        // };
        if (PowerPlant.cameraExist.indexOf(i) != -1) {
            var searchObj = searchResult.GetLocalObject(i);
            var ipIndex = PowerPlant.cameraExist.indexOf(i);
            if (ipIndex !== undefined){
                PowerPlant.showCameraIcon(searchObj, i, ipIndex);
            }
        }

        // var searchObj = searchResult.GetLocalObject(i);
        // PowerPlant.showCameraIcon(searchObj,i);
    }

};

/**
 * 清除所有标注
 *
 * @memberof PowerPlant
 *
 */
PowerPlant.clearIconLabel = function () {
    for (var id in PowerPlant.iconObjects) {
        earth.DetachObject(PowerPlant.iconObjects[id].label)
    }
    PowerPlant.iconObjects = {};
    PowerPlant.index = 0;
}

/**
 * 标注指定摄像头
 *
 * @memberof PowerPlant
 *
 * @return 转换后的图标文件路径
 */
PowerPlant.showCameraIcon = function (cameraObject, index, ipIndex) {
    // PowerPlant.createSearchIcon(PowerPlant.cameraParam)
    if (cameraObject == undefined || cameraObject == null) {
        return;
    }
    var campProperties = {};
    PowerPlant.getObjectPosition(cameraObject, campProperties);
    PowerPlant.createCameraIcon(cameraObject, campProperties, index, ipIndex);
}

/**
 * 创建标注，并将标注对象以其GUID作为key进行存储
 * @argument iconPath 原始图标路径（未转换格式）
 * @argument pos 要创建图标的位置
 * @argument obj 要标注的对象
 * @memberof PowerPlant
 *
 * @return 标注对象
 */
PowerPlant.createIconLabel = function (type, iconPath, pos, obj, index, ipIndex) {
    var cameraIconInfo = PowerPlant.getIconInfo(iconPath);
    var guid = earth.Factory.CreateGuid();
    var iconObject = earth.Factory.CreateElementIcon(guid, cameraIconInfo.name);
    iconObject.Visibility = false;

    //新增属性
    iconObject.textFormat = parseInt("0x100");
    iconObject.textColor = parseInt("0x" + cameraIconInfo.textColor.toString().substring(1).toLowerCase());
    iconObject.textHorizontalScale = cameraIconInfo.textHorizontalScale;
    iconObject.textVerticalScale = cameraIconInfo.textVerticalScale;
    iconObject.showHandle = cameraIconInfo.showHandle;
    iconObject.handleHeight = cameraIconInfo.handleHeight;
    iconObject.handleColor = parseInt("0x" + cameraIconInfo.handleColor.toString().substring(1).toLowerCase());
    iconObject.minVisibleRange = cameraIconInfo.minVisibleRange;
    iconObject.maxVisibleRange = cameraIconInfo.maxVisibleRange;
    iconObject.selectable = cameraIconInfo.selectable;
    iconObject.editable = cameraIconInfo.editable;
    iconObject.LineSize = 3;
    iconObject.Create(pos.lng, pos.lat, pos.alt, cameraIconInfo.iconNormalFileName, cameraIconInfo.iconSelectedFileName, cameraIconInfo.name);
    // PowerPlant.cameraIcon = iconObject;
    earth.AttachObject(iconObject);

    if (ipIndex) {
        PowerPlant.iconObjects[guid] = {
            "id": PowerPlant.index,
            "type": type,
            "label": iconObject,
            "obj": obj,
            "index": index,
            "ip": PowerPlant.cameraIp[ipIndex],
            "pos":pos
        };
    } else {//内部摄像头
        //iconObject.Visibility = false;
        PowerPlant.iconObjects[guid] = {
            "type": type,
            "label": iconObject,
            "obj": obj,
            "index": obj.cameraIndex,  //控制显示
            "pos":pos
        };
    }

    //PowerPlant.index++;
    return iconObject;
}

/**
 * 创建摄像头标注
 * @argument obj 要标注的摄像头对象
 * @argument campProperties 摄像头对象属性
 * @memberof PowerPlant
 *
 */
PowerPlant.createCameraIcon = function (obj, campProperties, index, ipIndex) {
    var pos = campProperties.position;
    var iconObj = PowerPlant.createIconLabel("cameraout", "icon\\camera32.png", pos, obj, index, ipIndex);
};

//内部摄像头
PowerPlant.createWorkCameraIcon = function (obj) {
    var pos = {
        lng: obj.lng,
        lat: obj.lat,
        alt: obj.alt,
    };
    var iconObj = PowerPlant.createIconLabel("camerain", "icon\\sxt.png", pos, obj);
};

/**
 * 获取格式转换后的图标路径，如果已经转换过格式则直接返回路径
 *
 * @memberof PowerPlant
 *
 * @return 转换后的图标文件路径
 */
PowerPlant._getConvertedIcon = function (iconSrcPath) {
    var iconConvertedPath = PowerPlant.iconPaths[iconSrcPath];
    if (iconConvertedPath != undefined) {
        return iconConvertedPath;
    }
    iconPath = earth.Environment.RootPath + iconSrcPath;
    var dataProcess = document.getElementById("dataProcess"); //将图片格式转换成规定格式并保存到model下
    dataProcess.Load();
    var texttrue = iconPath.split("\\");
    var texttrueFname = texttrue[texttrue.length - 1];
    var rootPath = earth.RootPath + STAMP_config.constants.USERDATA + texttrueFname;
    dataProcess.DataConvert.Convert_File(iconPath, rootPath);
    PowerPlant.iconPaths[iconSrcPath] = rootPath;
    return rootPath;
}

/**
 * 获取格式转换后的图标路径，如果已经转换过格式则直接返回路径
 *
 * @memberof PowerPlant
 *
 * @return 初始化后的图标信息，用于创建图标
 */
//监控图标初始化
/*PowerPlant.initCameraIcon = function() {*/
PowerPlant.getIconInfo = function (iconSrcPath) {
    var iconInfo = {};
    iconInfo.type = 209;
    //设置标注的默认值
    iconInfo.click = "true";
    iconInfo.name = "";
    iconInfo.desc = "";

    var rootPath = PowerPlant._getConvertedIcon(iconSrcPath);
    iconInfo.iconNormalFileName = rootPath;
    iconInfo.iconSelectedFileName = rootPath;

    var transparency = parseInt(255).toString(16);
    var textColor = "#ffffff";
    textColor = textColor.substring(1);
    iconInfo.textColor = "#" + transparency + textColor;
    iconInfo.textHorizontalScale = 1;
    iconInfo.textVerticalScale = 1;
    iconInfo.showHandle = false;
    iconInfo.handleHeight = 1;
    var handleColor = "#ffffff";
    handleColor = handleColor.substring(1);
    iconInfo.handleColor = "#" + transparency + handleColor;
    iconInfo.minVisibleRange = 0;
    iconInfo.maxVisibleRange = 3;
    iconInfo.selectable = false;
    iconInfo.editable = false;
    return iconInfo;
}

/**
 * 设置气泡窗口内菜单项点击的回调函数
 *
 * @memberof PowerPlant
 *
 * @type
 */
PowerPlant.setClickCallback = function (objProperties) {
    var balloon = PowerPlant.htmlBalloon;
    var div = PowerPlant.propertyDiv;
    if (balloon != undefined && balloon !== null && div != undefined) {
        var detailBtn = div.find("#detailBtn");
        detailBtn.show();
        detailBtn.click(function () {
            PowerPlant.detailBtnClicked(objProperties);
        });
    }
}

PowerPlant.detailBtnClicked = function (objProperties) {
    var detailInfo = PowerPlant.accessDetail;
    detailInfo.infoType = "accessDetail";
    var rect = {
        width: 360,
        height: 300
    }
    pos = objProperties.position;
    PowerPlant.showDetailBalloon(detailInfo, rect, pos);
};

//关闭设备总览及摄像总览树
PowerPlant.closeDeviceBallon = function () {
    if (PowerPlant.treeBalloon != null) {
        PowerPlant.treeBalloon.DestroyObject();
        PowerPlant.treeBalloon = null;
    }

};

//关闭设备详情
PowerPlant.closeTreeDetailBallon = function () {
    if (PowerPlant.treeDetailBalloon != null) {
        PowerPlant.treeDetailBalloon.DestroyObject();
        PowerPlant.treeDetailBalloon = null;
    }
};

//显示设备总览及摄像总览树
PowerPlant.showPropertyTreeBallon = function (treeNodes) {
    PowerPlant.closeDeviceBallon();
    PowerPlant.treeNodes = treeNodes;
    var balloon = LayerManagement.earth.Factory.CreateHtmlBalloon(LayerManagement.earth.Factory.CreateGuid(), PowerPlant.treeNodes.name);
    PowerPlant.deviceBalloon = balloon;
    balloon.SetRectSize(340, 1248);
    var wW = window.innerWidth;
    var wH = window.innerHeight;
    balloon.SetScreenLocation(0,40);
    balloon.SetIsAddCloseButton(false);
    balloon.SetIsAddMargin(false);
    balloon.SetIsAddBackgroundImage(true);
    balloon.SetIsTransparence(false);
    balloon.SetBackgroundAlpha(0);
    PowerPlant.treeBalloon = balloon;
    //balloon.SetBackgroundRGB(0x2167A3);
    var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    var url = windowUrl + '/ztreeTest.html';
    LayerManagement.earth.Event.OnDocumentReadyCompleted = function (guid) {
        if (guid == balloon.guid) {
            //resizeEarthToolWindow();
            //refreshEarthMenu();
            // alert("completed");

            // alert(PowerPlant.treeNodes.nodes.length);
            PowerPlant.setDeviceBalloonParameters();
        }
    };
    balloon.ShowNavigate(url);
};

//显示设备详情
PowerPlant.showDetailTreeBallon = function (treeNodes) {
    PowerPlant.closeTreeDetailBallon();
    PowerPlant.treeNodes = treeNodes;
    var balloon = LayerManagement.earth.Factory.CreateHtmlBalloon(LayerManagement.earth.Factory.CreateGuid(), PowerPlant.treeNodes.name);
    PowerPlant.deviceBalloon = balloon;
    balloon.SetRectSize(340, 1248);
    var wW = window.innerWidth;
    var wH = window.innerHeight;
    balloon.SetScreenLocation(wW,40);
    balloon.SetIsAddCloseButton(false);
    balloon.SetIsAddMargin(false);
    balloon.SetIsAddBackgroundImage(true);
    balloon.SetIsTransparence(false);
    balloon.SetBackgroundAlpha(0);
    PowerPlant.treeDetailBalloon = balloon;
    //balloon.SetBackgroundRGB(0x2167A3);
    var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    var url = windowUrl + '/ztreeTest1.html';
    LayerManagement.earth.Event.OnDocumentReadyCompleted = function (guid) {
        if (guid == balloon.guid) {
            //resizeEarthToolWindow();
            //refreshEarthMenu();
            // alert("completed");

            // alert(PowerPlant.treeNodes.nodes.length);
            PowerPlant.setDeviceBalloonParameters();
        }
    };
    balloon.ShowNavigate(url);
};

//传递数据用
PowerPlant.setDeviceBalloonParameters = function () {
    var parameter = {};
    parameter.updatePowerPlantDiv = function (div) {
        PowerPlant.propertyDiv = div;
    };
    parameter.pp = PowerPlant;
    PowerPlant.deviceBalloon.InvokeScript('setParameters', parameter);
    // alert('setParameters');
};

//显示统计信息
PowerPlant.showStatisicMsg = function () {
    var index = 0;
    var length = PowerPlant.staLocaltion.length;
    createBallon(index);

    function createBallon(index) {//递归调用
        if (index < length) {
            var item = PowerPlant.staLocaltion[index];
            var balloon = LayerManagement.earth.Factory.CreateHtmlBalloon(LayerManagement.earth.Factory.CreateGuid(), item.name);
            PowerPlant.staBalloons.push(balloon);
            balloon.SetRectSize(270, 170);
            // alert(item.lng+","+item.lat+","+item.lta);
            balloon.SetSphericalLocation(item.lng, item.lat, item.lta);
            // balloon.SetScreenLocation(500, 500);
            balloon.SetTailColor(parseInt("0xff03132c"));
            balloon.SetIsAddCloseButton(false);
            balloon.SetIsAddMargin(false);
            balloon.SetIsAddBackgroundImage(true);
            balloon.SetIsTransparence(false);
            balloon.SetBackgroundRGB(0xEDEDED);
            balloon.SetBackgroundAlpha(255);
            //balloon.SetBackgroundRGB(0x2167A3);
            var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
            var url = windowUrl + '/staMsg.html';
            LayerManagement.earth.Event.OnDocumentReadyCompleted = function (guid) {
                if (guid == balloon.guid) {
                    //resizeEarthToolWindow();
                    //refreshEarthMenu();
                    PowerPlant.name = item.name;
                    PowerPlant.setStaBalloonParameters(balloon);
                    createBallon(++index);
                }
            };
            balloon.ShowNavigate(url);
        }

    }

    // PowerPlant.staLocaltion.forEach(function (item,index) {
    //
    // });
};

PowerPlant.setStaBalloonParameters = function (ballon) {
    var parameter = {};
    parameter.updatePowerPlantDiv = function (div) {
        PowerPlant.propertyDiv = div;
    };
    parameter.pp = PowerPlant;
    ballon.InvokeScript('setParameters', parameter);
};


//内部区域摄像
PowerPlant.showAllCameraTree = function (data) {
    var treeNodes = {
        "name": "监控设备",
        "nodes": []
    };
    var treeRoot = {
        "id": "camera",
        "name": "摄像头",
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
    PowerPlant.cameraTreeNodes = treeNodes;
    // earth.GlobeObserver.FlytoLookat(109.413576, 38.034936, 1058.73,
    // 185.442,  //朝向
    // -29.228,  //俯仰
    // 220,      //距离
    // 451,		//相机高度
    // 3);  		//时间
};

//生成内部区域摄像图标
PowerPlant.showAllWorkCamera = function () {
    cameraList.forEach(function (item, index) {
        PowerPlant.createWorkCameraIcon(item);
    });
    // let index = 0;
    // for (let key in PowerPlant.iconObjects) {
    // 	if( PowerPlant.iconObjects[key] ){
    // 	    index++;
    // 	}
    // }
    // alert(index);
};

/*
* 添加场景内漫游功能
* */
//根据运动物体名称获取运动物体
PowerPlant.getDynamic = function (name) {
    earth.Event.OnDynamicListLoaded = function (list) {
        if (list == null) {
            return;
        }
        for (let i = 0; i < list.Count; i++) {
            var dynamic = list.Items(i);
            //Type Name Guid
            if (dynamic.Name == name) {
                PowerPlant.dynamic = dynamic;
            }
        }
        if (list.Count == 0) {
            return;
        }
    };
    earth.DynamicSystem.ApplyDynamicList();
};

PowerPlant.enterTrack = function (dynamicId) {
    earth.Event.OnCreateGeometry = function (position) {
        if (position != null) {
            PowerPlant.loadDynamicModel(dynamicId, position);
        }
    };
    earth.ShapeCreator.CreatePoint();
};
//添加对象
PowerPlant.loadDynamicModel = function (dynamicId, position) {
    earth.Event.OnDocumentChanged = function (type) {
        var dynamicObj = earth.DynamicSystem.GetSphericalObject(dynamicId);
        if (dynamicObj == null || position == null) {
            return;
        }

        dynamicObj.SphericalTransform.SetPose(position.Longitude, position.Latitude, position.Altitude, 75, 0, 0);
        PowerPlant.startTracking(dynamicId, 2, true);
        earth.Event.OnDocumentChanged = function () {

        };

    };
    earth.DynamicSystem.LoadDynamicObject(dynamicId);
};

//设置漫游
PowerPlant.startTracking = function (dynamicId, type, isInDoor) {
    if (isInDoor === true) {
        earth.Environment.SetIsIndoor(true);
    } else {
        earth.Environment.SetIsIndoor(false);
    }
    earth.GlobeObserver.StartTracking(dynamicId, type);
};

//退出漫游
PowerPlant.outTracking = function (dynamicId) {
    earth.GlobeObserver.StopTracking(); //摄像机停止跟随
    earth.GlobeObserver.Stop(); //摄像机停止动作
    if (dynamicId) {
        earth.DynamicSystem.UnLoadDynamicObject(dynamicId); //卸载运动物体对象
    }
};


/*
* 添加一键巡查功能
* */
PowerPlant.patrolAll = function () {
    var animate = new Promise(function (resolve, reject) {//用作启动器
        resolve();
    });
    animate
        // .then(function () {
        //     return new Promise(function (resolve, reject) {
        //         setTimeout(function () {//旋转
        //             earth.GlobeObserver.FlytoLookat(109.413576, 38.034936, 1058.73, 185.442, -29.228, 220, 650, 5);
        //             setTimeout(function () {
        //                 earth.GlobeObserver.SurroundControlEx(1);
        //             }, 5100);
        //             resolve();
        //         }, 2000);
        //     });
        // })
        // .then(function () {
        //     return new Promise(function (resolve, reject) {
        //         setTimeout(function () {//回到初始点
        //             PowerPlant.firestLook(5);
        //             PowerPlant.creatTrack();
        //             resolve();
        //         }, 35000); //35
        //     });
        // })
        // .then(function () {
        //     return new Promise(function (resolve, reject) {
        //         setTimeout(function () {//拉进办公楼
        //             promiseTrack(1000, 'yn3','西装男').then(function () {
        //                 return promiseTrack(2000, 'yn4','西装男')
        //             }).then(function () {
        //                 return promiseTrack(8000, 'yn1','西装男')
        //             }).then(function () {
        //                 return promiseTrack(1500, 'yn2','西装男')
        //             }).catch(function (err) {
        //                 alert('yn1d err')
        //             });
        //             earth.GlobeObserver.FlytoLookat(109.413819, 38.035301, 1089.000, 201.442, 23.228, 0, 128, 10);
        //             setTimeout(function () {//展示门禁数据
        //                 PowerPlant.closeAccessHtmlBalloon();
        //                 PowerPlant.accessMsg = 'BGL';
        //                 var position = {
        //                     lng: 109.4139224,
        //                     lat: 38.0357291,
        //                     alt: 1115.64
        //                 };
        //                 var balloon = LayerManagement.earth.Factory.CreateHtmlBalloon(LayerManagement.earth.Factory.CreateGuid(), 'access');
        //                 PowerPlant.accessHtmlBallon = balloon;
        //                 balloon.SetRectSize(280, 236);
        //                 balloon.SetSphericalLocation(position.lng, position.lat, position.alt);
        //                 // balloon.SetScreenLocation(500, 500);
        //                 balloon.SetTailColor(parseInt("0xff03132c"));
        //                 balloon.SetIsAddCloseButton(false);
        //                 balloon.SetIsAddMargin(false);
        //                 balloon.SetIsAddBackgroundImage(true);
        //                 balloon.SetIsTransparence(false);
        //                 balloon.SetBackgroundRGB(0xEDEDED);
        //                 balloon.SetBackgroundAlpha(255);
        //                 //balloon.SetBackgroundRGB(0x2167A3);
        //                 var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        //                 var url = windowUrl + '/access.html';
        //                 LayerManagement.earth.Event.OnDocumentReadyCompleted = function (guid) {
        //                     if (guid == balloon.guid) {
        //                         //resizeEarthToolWindow();
        //                         //refreshEarthMenu();
        //                         PowerPlant.setStaBalloonParameters(balloon);
        //                     }
        //                 };
        //                 balloon.ShowNavigate(url);
        //             }, 12100);
        //             resolve();
        //         }, 600);
        //     });
        // })
        // .then(function () {
        //     return new Promise(function (resolve, reject) {
        //         setTimeout(function () {//回到初始点
        //             PowerPlant.closeAccessHtmlBalloon();
        //             PowerPlant.firestLook(8);
        //             resolve();
        //         }, 30000);
        //     });
        // })
        // .then(function () {
        //     return new Promise(function (resolve, reject) {
        //         setTimeout(function () {//拉进集控楼
        //             promiseTrack(1000, 'yn5','西装男').then(function () {
        //                 return promiseTrack(2000, 'yn6','西装男')
        //             }).then(function () {
        //                 return promiseTrack(2000, 'yn7','西装男')
        //             }).then(function () {
        //                 return promiseTrack(1500, 'yn8','西装男')
        //             }).catch(function (err) {
        //                 alert('yn2d err')
        //             });
        //             earth.GlobeObserver.FlytoLookat(109.413192, 38.034407, 1088.800, 178.442, 39.228, 0, 120, 9);
        //             setTimeout(function () {//展示门禁数据
        //                 PowerPlant.closeAccessHtmlBalloon();
        //                 PowerPlant.accessMsg = 'JKL';
        //                 var position = {
        //                     lng: 109.4134772,
        //                     lat: 38.0345931,
        //                     alt: 1122.55
        //                 };
        //                 var balloon = LayerManagement.earth.Factory.CreateHtmlBalloon(LayerManagement.earth.Factory.CreateGuid(), 'access');
        //                 PowerPlant.accessHtmlBallon = balloon;
        //                 balloon.SetRectSize(280, 236);
        //                 balloon.SetSphericalLocation(position.lng, position.lat, position.alt);
        //                 // balloon.SetScreenLocation(500, 500);
        //                 balloon.SetTailColor(parseInt("0xff03132c"));
        //                 balloon.SetIsAddCloseButton(false);
        //                 balloon.SetIsAddMargin(false);
        //                 balloon.SetIsAddBackgroundImage(true);
        //                 balloon.SetIsTransparence(false);
        //                 balloon.SetBackgroundRGB(0xEDEDED);
        //                 balloon.SetBackgroundAlpha(255);
        //                 //balloon.SetBackgroundRGB(0x2167A3);
        //                 var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        //                 var url = windowUrl + '/access.html';
        //                 LayerManagement.earth.Event.OnDocumentReadyCompleted = function (guid) {
        //                     if (guid == balloon.guid) {
        //                         //resizeEarthToolWindow();
        //                         //refreshEarthMenu();
        //                         PowerPlant.setStaBalloonParameters(balloon);
        //                     }
        //                 };
        //                 balloon.ShowNavigate(url);
        //             }, 9100);
        //             resolve();
        //         }, 10000);
        //     })
        // })
        // .then(function () {
        //     return new Promise(function (resolve, reject) {
        //         setTimeout(function () {//回到初始点
        //             PowerPlant.closeAccessHtmlBalloon();
        //             PowerPlant.firestLook(8);
        //             resolve();
        //         }, 30000);
        //     });
        // })
        // .then(function () {
        //     return new Promise(function (resolve, reject) {
        //         setTimeout(function () {//拉进1#机组
        //             earth.GlobeObserver.FlytoLookat(109.413471, 38.032872, 1089.000, 203.442, 32.228, 0, 386, 10);
        //             setTimeout(function () {//展示数据
        //                 PowerPlant.staBalloons.forEach(function (item) {
        //                     item.DestroyObject();
        //                 });
        //                 var item = PowerPlant.staLocaltion[0];
        //                 var balloon = LayerManagement.earth.Factory.CreateHtmlBalloon(LayerManagement.earth.Factory.CreateGuid(), item.name);
        //                 PowerPlant.staBalloons.push(balloon);
        //                 balloon.SetRectSize(270, 170);
        //                 // alert(item.lng+","+item.lat+","+item.lta);
        //                 balloon.SetSphericalLocation(item.lng, item.lat, item.lta);
        //                 // balloon.SetScreenLocation(500, 500);
        //                 balloon.SetTailColor(parseInt("0xff03132c"));
        //                 balloon.SetIsAddCloseButton(false);
        //                 balloon.SetIsAddMargin(false);
        //                 balloon.SetIsAddBackgroundImage(true);
        //                 balloon.SetIsTransparence(false);
        //                 balloon.SetBackgroundRGB(0xEDEDED);
        //                 balloon.SetBackgroundAlpha(255);
        //                 //balloon.SetBackgroundRGB(0x2167A3);
        //                 var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        //                 var url = windowUrl + '/staMsg.html';
        //                 LayerManagement.earth.Event.OnDocumentReadyCompleted = function (guid) {
        //                     if (guid == balloon.guid) {
        //                         //resizeEarthToolWindow();
        //                         //refreshEarthMenu();
        //                         PowerPlant.name = item.name;
        //                         PowerPlant.setStaBalloonParameters(balloon);
        //                     }
        //                 };
        //                 balloon.ShowNavigate(url);
        //             }, 10100);
        //             resolve();
        //         }, 15000);
        //     })
        // })
        // .then(function () {
        //     return new Promise(function (resolve, reject) {
        //         setTimeout(function () {//回到初始点
        //             PowerPlant.staBalloons.forEach(function (item) {
        //                 item.DestroyObject();
        //             });
        //             PowerPlant.firestLook(10);
        //             resolve();
        //         }, 25000);
        //     });
        // })
        // .then(function () {
        //     return new Promise(function (resolve, reject) {
        //         setTimeout(function () {//拉进2#机组
        //             earth.GlobeObserver.FlytoLookat(109.413879, 38.034228, 1125.300, 335.442, 25.228, 0, 422, 10);
        //             setTimeout(function () {//展示数据
        //                 PowerPlant.staBalloons.forEach(function (item) {
        //                     item.DestroyObject();
        //                 });
        //                 var item = PowerPlant.staLocaltion[1];
        //                 var balloon = LayerManagement.earth.Factory.CreateHtmlBalloon(LayerManagement.earth.Factory.CreateGuid(), item.name);
        //                 PowerPlant.staBalloons.push(balloon);
        //                 balloon.SetRectSize(270, 170);
        //                 // alert(item.lng+","+item.lat+","+item.lta);
        //                 balloon.SetSphericalLocation(item.lng, item.lat, item.lta);
        //                 // balloon.SetScreenLocation(500, 500);
        //                 balloon.SetTailColor(parseInt("0xff03132c"));
        //                 balloon.SetIsAddCloseButton(false);
        //                 balloon.SetIsAddMargin(false);
        //                 balloon.SetIsAddBackgroundImage(true);
        //                 balloon.SetIsTransparence(false);
        //                 balloon.SetBackgroundRGB(0xEDEDED);
        //                 balloon.SetBackgroundAlpha(255);
        //                 //balloon.SetBackgroundRGB(0x2167A3);
        //                 var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        //                 var url = windowUrl + '/staMsg.html';
        //                 LayerManagement.earth.Event.OnDocumentReadyCompleted = function (guid) {
        //                     if (guid == balloon.guid) {
        //                         //resizeEarthToolWindow();
        //                         //refreshEarthMenu();
        //                         PowerPlant.name = item.name;
        //                         PowerPlant.setStaBalloonParameters(balloon);
        //                     }
        //                 };
        //                 balloon.ShowNavigate(url);
        //             }, 10100);
        //             resolve();
        //         }, 15000);
        //     })
        // })
        // .then(function () {
        //     return new Promise(function (resolve, reject) {
        //         setTimeout(function () {//展示2个机组信息
        //             PowerPlant.staBalloons.forEach(function (item) {
        //                 item.DestroyObject();
        //             });
        //             earth.GlobeObserver.FlytoLookat(109.413525, 38.032967, 1089.300, 219.080, 43.228, 0, 430, 10);
        //             setTimeout(function () {
        //                 PowerPlant.showStatisicMsg();
        //             },10100);
        //             resolve();
        //         }, 15000);
        //     });
        // })
        // .then(function () {
        //     return new Promise(function (resolve, reject) {
        //         setTimeout(function () {//回到初始点
        //             PowerPlant.staBalloons.forEach(function (item) {
        //                 item.DestroyObject();
        //             });
        //             PowerPlant.firestLook(10);
        //             resolve();
        //         }, 17000);
        //     });
        // })
        .then(function () {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {//拉进2#冷凝塔
                    earth.GlobeObserver.FlytoLookat(109.417017, 38.033926, 1126, 346, 20.788, 0, 460, 10);
                    setTimeout(function () {//展示数据
                        PowerPlant.condBalloons.forEach(function (item) {
                            item.DestroyObject();
                        });
                        var item = {
                            name: '2#',
                            lng: 109.4171969,
                            lat: 38.0323189,
                            alt: 1207.96
                        };
                        var balloon = LayerManagement.earth.Factory.CreateHtmlBalloon(LayerManagement.earth.Factory.CreateGuid(), item.name);
                        PowerPlant.condBalloons.push(balloon);
                        balloon.SetRectSize(270, 170);
                        balloon.SetSphericalLocation(item.lng, item.lat, item.alt);
                        balloon.SetTailColor(parseInt("0xff03132c"));
                        balloon.SetIsAddCloseButton(false);
                        balloon.SetIsAddMargin(false);
                        balloon.SetIsAddBackgroundImage(true);
                        balloon.SetIsTransparence(false);
                        balloon.SetBackgroundRGB(0xEDEDED);
                        balloon.SetBackgroundAlpha(255);
                        var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
                        var url = windowUrl + '/condsTower.html';
                        LayerManagement.earth.Event.OnDocumentReadyCompleted = function (guid) {
                            if (guid == balloon.guid) {
                                PowerPlant.name = item.name;
                                PowerPlant.setStaBalloonParameters(balloon);
                            }
                        };
                        balloon.ShowNavigate(url);
                    }, 10100);
                    resolve();
                }, 8000);
            })
        })
        .then(function () {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {//循环浏览
                    PowerPlant.condBalloons.forEach(function (item) {
                        item.DestroyObject();
                    });
                    earth.GlobeObserver.FlytoLookat(109.417422, 38.032881, 1094, 21.854, 57.587, 0, 112, 8);
                    setTimeout(function () {
                        earth.GlobeObserver.SurroundControlEx(1);
                    }, 8100);
                    resolve();
                }, 15000);
            });
        })
        .then(function () {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {//拉进1#冷凝塔
                    earth.GlobeObserver.FlytoLookat(109.416771, 38.033538, 1094, 192.8, 25.228, 0, 476, 10);
                    setTimeout(function () {//展示数据
                        PowerPlant.condBalloons.forEach(function (item) {
                            item.DestroyObject();
                        });
                        var item = {
                            name: '1#',
                            lng: 109.4174339,
                            lat: 38.0351913,
                            alt: 1217.64
                        };
                        var balloon = LayerManagement.earth.Factory.CreateHtmlBalloon(LayerManagement.earth.Factory.CreateGuid(), item.name);
                        PowerPlant.condBalloons.push(balloon);
                        balloon.SetRectSize(270, 170);
                        balloon.SetSphericalLocation(item.lng, item.lat, item.alt);
                        balloon.SetTailColor(parseInt("0xff03132c"));
                        balloon.SetIsAddCloseButton(false);
                        balloon.SetIsAddMargin(false);
                        balloon.SetIsAddBackgroundImage(true);
                        balloon.SetIsTransparence(false);
                        balloon.SetBackgroundRGB(0xEDEDED);
                        balloon.SetBackgroundAlpha(255);
                        var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
                        var url = windowUrl + '/condsTower.html';
                        LayerManagement.earth.Event.OnDocumentReadyCompleted = function (guid) {
                            if (guid == balloon.guid) {
                                PowerPlant.name = item.name;
                                PowerPlant.setStaBalloonParameters(balloon);
                            }
                        };
                        balloon.ShowNavigate(url);
                    }, 10100);
                    resolve();
                }, 30000);
            })
        })
        .then(function () {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {//回到初始点
                    PowerPlant.condBalloons.forEach(function (item) {
                        item.DestroyObject();
                    });
                    PowerPlant.firestLook(10);
                    resolve();
                }, 15000);
            });
        })
        .then(function () {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {//拉进煤场
                    earth.GlobeObserver.FlytoLookat(109.419223, 38.033049, 1099.19, 273.442, 36.228, 0, 314, 10);
                    setTimeout(function () {//展示数据
                        PowerPlant.condBalloons.forEach(function (item) {
                            item.DestroyObject();
                        });
                        var item = {
                            name: 'coalYard',
                            lng: 109.4194392,
                            lat: 38.0330849,
                            alt: 1148.61
                        };
                        var balloon = LayerManagement.earth.Factory.CreateHtmlBalloon(LayerManagement.earth.Factory.CreateGuid(), item.name);
                        PowerPlant.condBalloons.push(balloon);
                        balloon.SetRectSize(270, 170);
                        balloon.SetSphericalLocation(item.lng, item.lat, item.alt);
                        balloon.SetTailColor(parseInt("0xff03132c"));
                        balloon.SetIsAddCloseButton(false);
                        balloon.SetIsAddMargin(false);
                        balloon.SetIsAddBackgroundImage(true);
                        balloon.SetIsTransparence(false);
                        balloon.SetBackgroundRGB(0xEDEDED);
                        balloon.SetBackgroundAlpha(255);
                        var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
                        var url = windowUrl + '/condsTower.html';
                        LayerManagement.earth.Event.OnDocumentReadyCompleted = function (guid) {
                            if (guid == balloon.guid) {
                                PowerPlant.name = item.name;
                                PowerPlant.setStaBalloonParameters(balloon);
                            }
                        };
                        balloon.ShowNavigate(url);
                    }, 10100);
                    resolve();
                }, 15000);
            })
        })
        .then(function () {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {//回到初始点
                    PowerPlant.condBalloons.forEach(function (item) {
                        item.DestroyObject();
                    });
                    PowerPlant.firestLook(10);
                    resolve();
                }, 15000);
            });
        })
        .catch(function (err) {
            alert('partolAll err');
        })
};

//回到视点
PowerPlant.firestLook = function (time) {
    earth.GlobeObserver.FlytoLookat(109.413576, 38.034936, 1058.73, 185.442, -29.228, 220, 451, time);
};

//飞行路径
PowerPlant.creatTrack = function () {
    //获取路径调用方法
    PowerPlant.trackManager = STAMP.TrackManager(earth);
    //获取全部路径
    PowerPlant.trackList = PowerPlant.trackManager.getTracks();
    PowerPlant.trackList.forEach(function (item, index) {
        PowerPlant.trackManager.createTrack(item.ID, item.NAME);
    });
};
//根据名字开始track 删除运动物体
PowerPlant.startFly = function (trackName, dyName) {
    PowerPlant.getDynamic(dyName);
    var trackId = PowerPlant.getTrackByName(trackName);
    var track = earth.TrackControl.GetTrack(trackId);
    earth.Event.OnDocumentChanged = function (type, newGuid) {
        if (type == 3) {
            return;
        }
        if (type == 2) { // 飞行对象加载成功
            earth.Event.OnTrackFinish = function (tId, objId) {
                earth.DynamicSystem.UnLoadDynamicObject(objId);
            };
            PowerPlant.startFlyAction(trackId, newGuid); //飞行
        }
        earth.Event.OnDocumentChanged = function () {
        };
        if (typeof callback != 'undefined' && callback != null) {

        }
    };
    setTimeout(function () {
        var dynamic = PowerPlant.dynamic; //运动对象Guid  不变值
        earth.DynamicSystem.LoadDynamicObject(dynamic.Guid);
    }, 100);
};
//根据名字获取trackid
PowerPlant.getTrackByName = function (name) {
    var trackID;
    PowerPlant.trackList.forEach(function (item, index) {
        if (item.NAME == name) {
            trackID = item.ID;
        }
    });
    return trackID;
};
//采用直接暂停飞行
PowerPlant.startFlyAction = function (trackId, dynamicGuid) {
    var track = earth.TrackControl.GetTrack(trackId);
    track.BindObject = dynamicGuid;
    earth.TrackControl.SetMainTrack(trackId, 4);
    //alert(cTrackType);  1为第一人称，3为第三人称，4为自由跟随
    track.CommitChanges();
    track.Play(false);
};
//Promise生成
var promiseTrack = function (time, trackName, dyName) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            PowerPlant.startFly(trackName, dyName);
            resolve();　　//在异步操作执行完后执行 resolve() 函数
        }, time);
    });
};
//摄像头编号对比
// setTimeout(function () {
// 	var guid = earth.Factory.CreateGuid();
// 	var htmlBalloon = earth.Factory.CreateHtmlBalloon(guid, '1');
// 	htmlBalloon.SetIsAddCloseButton(true);
// 	htmlBalloon.SetIsAddMargin(false);
// 	htmlBalloon.SetIsAddBackgroundImage(false);
// 	htmlBalloon.SetIsTransparence(true);
// 	htmlBalloon.SetBackgroundRGB(0x000000);
// 	htmlBalloon.SetBackgroundAlpha(0);
// 	alert(1);
// 	var url = PowerPlant.getFullUrl("/html/camera.html");
// 	htmlBalloon.SetTailColor(0xff000000);
// 	htmlBalloon.SetRectSize(1248, 737);
// 	htmlBalloon.SetScreenLocation(0, 0);
// 	htmlBalloon.ShowNavigate(url);
// },1000)

// setTimeout(function () {
// 	var guid = earth.Factory.CreateGuid();
//  	var htmlBalloon = earth.Factory.CreateHtmlBalloon(guid, '2');
//  	htmlBalloon.ShowHtml("<div id='test' value='good'>TEST</div>");
//  	setTimeout(function () {
//  		// alert(1);
// 		alert(htmlBalloon.GetHtmlElementAttribute('test','innerHtml'));
// 	},1000)
// },1000)

/*
* 通过编号搜索设备并高亮显示设备
* */
PowerPlant.highlightSearchDevice = function (node) {
    var name;
    if( node.id.indexOf("-M0") != -1 ){
        var idArr = node.id.toUpperCase().split('_S');
        name = idArr[0]+"_S"+idArr[1];
    }else{
        name = node.id.toUpperCase();
    }
    var layersArr = [];
    var allDeviceLayers = PowerPlant._getLayerByName("设备");
    var count = allDeviceLayers.GetChildCount();
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
        PowerPlant.searchHighLightDevice(item,name,node);
    });

};
PowerPlant.searchHighLightDevice = function (deviceLayer, objName, node) {
    // var deviceLayer = PowerPlant._getLayerByName("设备");
    //alert(deviceLayer.LayerType+":"+deviceLayer.Name);
    if (deviceLayer.LayerType.toLowerCase() != 'model') {
        return
    }
    var lng = node.lng;
    var lat = node.lat;
    // var lonLatRect = deviceLayer.LonLatRect;
    // var lng = (lonLatRect.East + lonLatRect.West) / 2;
    // var lat = (lonLatRect.North + lonLatRect.South) / 2;
    var param = {
        lng: lng,
        lat: lat,
        radius:0.2
    };
    var searchCircle = PowerPlant._getCircleVectors(param);
    if (deviceLayer === undefined || deviceLayer == null) return;
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
    PowerPlant.showHighlightObj(searchResult,objName,node);
};
//高亮搜索的设备
PowerPlant.showHighlightObj = function(searchResult,objName,node){
    if ( searchResult.RecordCount < 1 || searchResult.RecordCount == null){
        return;
    }
    for (var i = 0; i < searchResult.RecordCount; i++) {
        var deviceObj = searchResult.GetLocalObject(i);
        var rect = deviceObj.GetLonLatRect();
        var modelLng = (rect.East + rect.West)/2;
        var modelLat = (rect.North + rect.South)/2;
        var modelAlt = (rect.MaxHeight + rect.MinHeight)/2;
        var x = Math.abs(modelLng-node.lng);
        var y = Math.abs(modelLat-node.lat);
        var z = Math.abs(modelAlt-node.alt);

        if ( x < 0.000001 && y < 0.000001 && z < 0.01){
            PowerPlant.highlightObject(deviceObj);
            return false;
        }
        // if( objName == name ){
        //     PowerPlant.highlightObject(deviceObj);
        // }
    }
};


/*
* 通过摄像头设备树播放视频
* */
PowerPlant.showHikVideo = function (node) {
    PowerPlant.closeHtmlBalloon();

    earth.Event.OnDocumentReadyCompleted = function (guid) {//气泡加载完成事件
        if (guid == htmlBalloon.guid) {
            PowerPlant.setBalloonParameters();
        }
    };
    var url = PowerPlant.getFullUrl("/html/demo/hikvideo.html");
    var guid = earth.Factory.CreateGuid();
    var htmlBalloon = PowerPlant.createHtmlBalloon(guid, "URL气泡");
    var wW = window.innerWidth;
    var wH = window.innerHeight;
    PowerPlant.workCameraProperty = {};
    PowerPlant.workCameraProperty.ip = node.ip;
    PowerPlant.workCameraProperty.password = node.password;
    htmlBalloon.SetRectSize(700, 435);
    htmlBalloon.SetScreenLocation (wW/2,wH/2+200);
    PowerPlant.htmlBalloon = htmlBalloon;
    htmlBalloon.ShowNavigate(url);
};

/*
* 通过监听hash值变化来达到报警摄像头展示效果
* */
window.addEventListener('hashchange',function () {
    PowerPlant.hash = window.location.hash;
    // alert(PowerPlant.hash);
    PowerPlant.hashCreat(PowerPlant.hash);
});

//hash传入值解析并生成摄像头视窗
PowerPlant.hashCreat = function (hash) {
    var arr1 = hash.split('&');
    var ip = arr1[0].split('#')[1];
    var password = arr1[1];
    var cameraType = arr1[2];
    var testIp;
    alert(cameraType+","+testIp);
    PowerPlant.closeHtmlBalloon();

    earth.Event.OnDocumentReadyCompleted = function (guid) {//气泡加载完成事件
        if (guid == htmlBalloon.guid) {
            PowerPlant.setBalloonParameters();
        }
    };
    var url = PowerPlant.getFullUrl("/html/demo/hikvideo.html");
    var guid = earth.Factory.CreateGuid();
    var htmlBalloon = PowerPlant.createHtmlBalloon(guid, "URL气泡");
    var wW = window.innerWidth;
    var wH = window.innerHeight;
    if ( cameraType == 'cameraout'){
        testIp = Number(ip.split('.')[3]);
        if ( PowerPlant.cameraIp.indexOf(testIp) != -1){
            for (var key in PowerPlant.iconObjects){
                if ( PowerPlant.iconObjects[key].ip == testIp){
                    PowerPlant.iconObjects[key].label.Visibility = true;
                    var nowPos = PowerPlant.iconObjects[key].pos;
                    earth.GlobeObserver.FlytoLookat(nowPos.lng, nowPos.lat, nowPos.alt,
                        0.0,  //朝向
                        30,  //俯仰
                        0.0,      //旋转角
                        40,		//相机距离
                     3);
                    setTimeout(function () {
                        PowerPlant.workCameraProperty = {};
                        PowerPlant.workCameraProperty.ip = ip;
                        PowerPlant.workCameraProperty.password = password;
                        htmlBalloon.SetRectSize(700, 435);
                        htmlBalloon.SetSphericalLocation(nowPos.lng, nowPos.lat, nowPos.alt);
                        htmlBalloon.SetTailColor(0xff000000);
                        PowerPlant.htmlBalloon = htmlBalloon;
                        htmlBalloon.ShowNavigate(url);
                    },3000)
                }
            }
        }
        else{
            PowerPlant.workCameraProperty = {};
            PowerPlant.workCameraProperty.ip = ip;
            PowerPlant.workCameraProperty.password = password;
            htmlBalloon.SetRectSize(700, 435);
            htmlBalloon.SetScreenLocation (wW/2,wH/2+200);
            PowerPlant.htmlBalloon = htmlBalloon;
            htmlBalloon.ShowNavigate(url);
        }
    }
};