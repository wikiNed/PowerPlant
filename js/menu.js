/**
 * 作       者：Wk
 * 创建日期：2019年9月5日
 * 描        述：新菜单
 * 注意事项：完成部分功能
 * 遗留bug：0
 * 修改日期：
 ******************************************/
var menu = {
    level: 0,
    fListBallon: null,
    sListBallon: null,
    clickId: null,
    staClicked: false,
    layerClick: false
};
var menuNode = {};
var data = STAMP.menuConfig.menu; //数据来源
addNode(data, 0, "0");

function addNode(data, level, parent) { //todo
    data.forEach(function (item, index) {
        item.level = level;
        item.parent = parent;
        if (item.item) { //有子级，循环添加
            item.hasChildren = true;
            item.isClicked = false;
            menuNode[item.id] = item;
            addNode(item.item, level + 1, item.id);
        } else {
            item.hasChildren = false;
            menuNode[item.id] = item;
        }
    })
}

function showNode(level) {
    menuNode.forEach(function (item, index) {

    })
}

function menuClose() { //二级菜单关闭
    if (menu.sListBallon != null) {
        menu.sListBallon.DestroyObject();
        menu.sListBallon = null;
    }
}


function showMenu(direction, p_id) {
    var arr = [];
    var width = 50;
    var height = 50;
    for (var key in menuNode) {
        if (menuNode[key].parent == p_id) {
            arr.push(menuNode[key]);
        }
    }
    // menuNode.forEach(function (item,index) {
    //         if( item.parent == p_id ){
    //             arr.push(item);
    //         }
    // });
    if (direction == "hori") { //hori横向 verti纵向 并控制气泡宽高
        width = width * arr.length;
        height = height;
    }
    ;
    var balloon = LayerManagement.earth.Factory.CreateHtmlBalloon(LayerManagement.earth.Factory.CreateGuid(), this.title);

    var wW = window.innerWidth;
    var wH = window.innerHeight;
    var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    var url;
    if (p_id == "0") {
        balloon.SetRectSize(800, 68);
        menu.fListBallon = balloon;
        balloon.SetScreenLocation(wW / 2, wH - 80); //950 850
        url = windowUrl + '/menu.html';
    } else {
        menuClose();
        balloon.SetRectSize(493, 68);
        menu.sListBallon = balloon;
        balloon.SetScreenLocation(wW / 2, wH - 135); //880 780
        url = windowUrl + '/menu1.html';
    }
    balloon.SetIsAddCloseButton(false);
    balloon.SetIsAddMargin(false);
    balloon.SetIsAddBackgroundImage(true);
    balloon.SetIsTransparence(false);
    balloon.SetBackgroundAlpha(0);
    //balloon.SetBackgroundRGB(0x2167A3);

    // var url = '../menu.html';
    LayerManagement.earth.Event.OnDocumentReadyCompleted = function (guid) {
        if (guid == balloon.guid) {
            //resizeEarthToolWindow();
            //refreshEarthMenu();
            setBalloonParameters(balloon, p_id);
            setBalloonContents(balloon, arr, p_id);
        }
    };
    balloon.ShowNavigate(url);
}

function setBalloonParameters(balloon, p_id) {
    var parameter = {};
    parameter.updateEarthMenuDiv = function (div) {
        menu["div" + p_id] = div;
    };
    //funcPara.earthToolHeight = earthToolHeight - 32;
    balloon.InvokeScript('setParameters', parameter);
}

/**
 * 设置气泡窗口内菜单图层内html内容
 *
 * @memberof EarthMenu.prototype
 *
 * @type {EarthMenu}
 */
function setBalloonContents(balloon, arr, p_id) {
    var div = menu["div" + p_id];
    if (balloon != undefined && div != undefined) {
        var innerHtml = '';
        arr.forEach(function (item) {
            //"id": "view",
            //         "name": "场景",
            //         "title": "场景",
            //         "src": "images/icon/场景.png",
            innerHtml += "<li canClose='" + item.close + "' id='" + item.id + "' title='" + item.title + "'><div><span class='iconfont " + item.icon + "'></span></div></li>";
        });
        // alert(JSON.stringify(innerHtml));
        div.find("ul").html(innerHtml);
        setClickCallback(balloon, p_id);
    }
}

/**
 * 设置气泡窗口内菜单项点击的回调函数
 *
 * @memberof EarthMenu.prototype
 *
 * @type {EarthMenu}
 */
function setClickCallback(balloon, p_id) {
    if (balloon != undefined && menu["div" + p_id] != undefined) {
        // alert(p_id);
        var div = menu["div" + p_id];
        div.find("ul li").on("click", function () {
            var id = $(this).attr("id");
            // alert(JSON.stringify(id));
            var closeType = $(this).attr("canClose");
            if (closeType === 'able') {
                $(this).toggleClass('on');
            } else {

            }
            if (menuNode[id].hasChildren && menuNode[id].level < 2) {
                menuClose();
                if (id != menu.clickId) {//切换菜单
                    showMenu("hori", id);
                    menu.clickId = id;
                    // alert("div"+p_id+";"+menu["div" + p_id].isClicked);
                } else {
                    menu.clickId = null;
                }
            } else if (!menuNode[id].hasChildren) {
                try {
                    if (typeof window[id + "Clicked"] == "function") {
                        // EarthMenu.earthMenuRoot.hideChildrenMenu();	//菜单点击后收起子菜单
                        window[id + "Clicked"](id);	//这里需要注意，一定要先设置状态，再调用相应功能处理函数，功能处理中会判断菜单状态
                    } else {
                        alert("请先定义" + id + "Clicked方法");
                    }
                } catch (e) {
                    alert(e);
                    alert(id + "Clicked方法异常！");
                }
            }
        })
    }
};

menu.resizeMenu = function () {
    var wW = window.innerWidth;
    var wH = window.innerHeight;
    if (menu.fListBallon !== null) {
        menu.fListBallon.SetScreenLocation(wW / 2, wH - 80)
    }
    if (menu.sListBallon !== null) {
        menu.sListBallon.SetScreenLocation(wW / 2, wH - 135)
    }
};

menu.closeAllHtmlBalloon = function () {
    if (menu.fListBallon !== null) {
        menu.fListBallon.DestroyObject();
        menu.fListBallon = null;
    }
    if (menu.sListBallon !== null) {
        menu.sListBallon.DestroyObject();
        menu.sListBallon = null;
    }
    menu.clickId = null;
};
