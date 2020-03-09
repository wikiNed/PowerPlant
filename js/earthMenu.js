/**
 * 作       者：sn
 * 创建日期：2018年11月01日
 * 描        述：一级菜单：菜单功能方法
 * 注意事项：
 * 遗留bug：0
 * 修改日期：2018年11月13日
 ******************************************/


var MenuConst = {
    /**
     * horizontal menu
     *
     * @constant
     */
	HORIZONTAL : 0,

    /**
     * vertical menu
     *
     * @constant
     */
    VERTICAL : 1,
    
    /**
     * 菜单边框
     * 从目前窗口大小与html页面的宽度来看，html balloon有22px的边框
     * 
     * @constant
     */
    BORDER_MARGIN : 24,
    
    /**
     * 三维球底部留空高度
     * 底部留32px显示三维球的一些信息
     *
     * @constant
     */
    BOTTOM_MARGIN : 32,
    
    /**
     * 菜单内上下滚动按钮高度
     *
     * @constant
     */
    SCROLL_BTN_HEIGHT : 22,
    
    /**
     * 垂直方向菜单每一项的高度
     *
     * @constant
     */
    ITEM_V_HEIGHT : 68,
    
    /**
     * 水平方向菜单每一项的高度
     *
     * @constant
     */
    ITEM_H_HEIGHT : 68,
    
    /**
     * 垂直方向菜单每一项的高度
     *
     * @constant
     */
    ITEM_V_WIDTH : 60,
    
    /**
     * 水平方向菜单每一项的高度
     *
     * @constant
     */
    ITEM_H_WIDTH : 60,
    
    /**
     * 水平方向菜单之间的间隙
     *
     * @constant
     */
    MENU_GAP : 6
};

/**
 * 球内菜单，所有菜单相关信息存于该对象中
 *
 * @type {EarthMenu}
 */
function EarthMenu() {
	this._index = undefined;
	this._id = undefined;
	this.image = undefined;
	this.name = undefined;
	this.title = undefined;
	this._position = undefined;
	this._width = 0;
	this._height = 0;
	this.htmlBalloon = undefined;
	this.children = [];
	this.url = undefined;
	this.parent = undefined;
	this._direction = MenuConst.HORIZONTAL;//水平0
	this._menuDiv = undefined;
	this._zoom = 1.0;
	this._status = false;
	this._level = undefined;	// 菜单级别，root为0级，往下依次递增
	this.childItems = undefined;		// 对于有子菜单的二级菜单，不加载子菜单，只保存其含有的菜单项，用于在图层的面板中显示三维菜单
}

EarthMenu.earthMenuRoot = undefined;
EarthMenu.earthMenuMap = {};
EarthMenu.refreshFlag = false;
//获取menuconfig数据
EarthMenu.initEarthMenu = function() {
	if (EarthMenu.earthMenuRoot === undefined) {
		var earthMenuRoot = new EarthMenu();
		earthMenuRoot.loadMenu(STAMP.menuConfig.menu);
		earthMenuRoot.showMenu();
		EarthMenu.earthMenuRoot = earthMenuRoot;
	}
}
//Menu可见性
EarthMenu.setMenuVisible = function(isVisible) {
	EarthMenu.earthMenuRoot.setIsVisible(isVisible);
}
//添加子节点
EarthMenu.addMenuNode = function(menuID, menuNode) {
	if (menuID != undefined && menuID != null && menuNode != undefined && menuNode != null) {
		EarthMenu.earthMenuMap[menuID] = menuNode;
	}
}

EarthMenu.getMenuNode = function(menuID) {
	if (menuID != undefined && menuID != null) {
		var menuNode = EarthMenu.earthMenuMap[menuID];
		if (menuNode != undefined) {
			return menuNode;
		}
	}
	return null;
}

EarthMenu.isMenuClicked = function(menuID) {
	if (menuID != undefined && menuID != null) {
		var menuNode = EarthMenu.earthMenuMap[menuID];
		if (menuNode != undefined) {
			return menuNode.isClicked;
		}
	}
	return false;
}

EarthMenu.cancelMenuClick = function(menuID) {
	if (menuID != undefined && menuID != null) {
		var menuNode = EarthMenu.earthMenuMap[menuID];
		if (menuNode != undefined && menuNode != null && menuNode.isLeaf) {	//仅叶子节点才能直接取水点击状态
			menuNode.isClicked = false;
		}
	}
}

//未使用
EarthMenu.closeAllMenu = function() {
	EarthMenu.earthMenuRoot.hideMenu();	// 释放所有菜单资源，并取水所有菜单点击状态
}

//未使用
EarthMenu.refreshMenu = function() {
	var earthDiv = document.getElementById('mainDiv');
	if (EarthMenu.refreshFlag) {
		earthDiv.style.height += 1;
	} else {
		earthDiv.style.height -= 1;
	}
	EarthMenu.refreshFlag = !EarthMenu.refreshFlag;
}

EarthMenu.getMenuHeight = function() {
	return EarthMenu.earthMenuRoot.balloonHeight;
}

EarthMenu.resizeMenuHeight = function(height) {
	EarthMenu.earthMenuRoot.resizeMenu(height);
	//EarthMenu.refreshMenu();
}

EarthMenu.resizeMenu = function() {
	EarthMenu.resizeMenuHeight(0);
}

Object.defineProperties(EarthMenu.prototype, {
	/**
     * 获取菜单项的id
     *
     * @memberof EarthMenu.prototype
     *
     * @type {EarthMenu}
     * @readonly
     */
	id : {
		get : function() {
			return this._id;
		},
		set : function(value) {
			this._id = value;
		}
	},
	//记数
	index: {
		get : function() {
			return this._index;
		},
		set : function (value) {
			this._index = value;
		}
	},
    /**
     * 获取菜单的html元素，用于气泡窗口中html的显示
     *
     * @memberof EarthMenu.prototype
     *
     * @type {EarthMenu}
     * @readonly
     */
	html: {
		get: function () {
			var htmlText =
				'<div id="' + this.id + '" title="' + this.title;
			if (this.parent.direction == MenuConst.VERTICAL) {
				htmlText += '" class="choose menuItemV">' + '<img src="' + this.image + '" /><br/>';
			} else {
				htmlText += '" class="choose menuItemH">' + '<img src="' + this.image + '" />';
			}
			htmlText += '<span>' + this.name + '</span></div>';
			return htmlText;
		}
	},
	htmlodd: {
		get: function () {
			var htmlText =
				'<div id="' + this.id + '" title="' + this.title;
			if (this.parent.direction == MenuConst.VERTICAL) {
				htmlText += '" class="choose menuItemV odd">' + '<img src="' + this.image + '" /><br/>';
			} else {
				htmlText += '" class="choose menuItemH odd"  style="position: absolute;left: 60px;top: ' + Math.floor(this.index / 2) * 69 + 'px">' + '<img src="' + this.image + '" />';
			}
			htmlText += '<span>' + this.name + '</span></div>';
			return htmlText;
		}
	},
	/**
     * 获取子菜单项的html元素，用于气泡窗口中html的显示
     *
     * @memberof EarthMenu.prototype
     *
     * @type {EarthMenu}
     * @readonly
     */
	childrenHtml: {
		get: function () {
			var htmlText = "";
			var children = this.children;
			var level = this.level;
			var length = children.length;
			if (level == 1) {
				//头部信息
				// htmlText += "<div class='head'>" +
				// 	"<i>       " +
				// 	"<img src='../../images/tools/"+this.title+".png'>" +
				// 	"</i>" +
				// 	"<p class='title'>"+this.title+"</p>" +
				// 	"<p id='close'>×</p>" +
				// 	"</div>";
				for (var i = 0; i < length; i++) {
					if (i % 2) {
						htmlText += children[i].htmlodd;
					} else {
						htmlText += children[i].html;
					}
				}
			} else {
				for (var i = 0; i < length; i++) {
					htmlText += children[i].html;
				}
			}
			return htmlText;
		}
	},
	/**
     * 获取子菜单显示方向，即图片与文字排列的方式是水平还是垂直的
     * 目前仅第一级菜单为垂直方向
     *
     * @memberof EarthMenu.prototype
     *
     * @type {EarthMenu}
     * @readonly
     */
    direction : {
    	get : function() {
    		return this._direction;
    	},
    	set : function(value) {
    		this._direction = value;
    	}
    },
	/**
     * 获取菜单的宽度
     *
     * @memberof EarthMenu.prototype
     *
     * @type {EarthMenu}
     * @readonly
     */
    width : {
    	get : function() {
    		if (this.direction == MenuConst.VERTICAL) {
    			return MenuConst.ITEM_V_WIDTH;
    		}
    		else {
    			return MenuConst.ITEM_H_WIDTH*2;
    		}
    	}
    },
    /**
     * 获取菜单气泡窗口的宽度
     *
     * @memberof EarthMenu.prototype
     *
     * @type {EarthMenu}
     * @readonly
     */
    balloonWidth : {
    	get : function() {
    		return this.width + MenuConst.BORDER_MARGIN;
    	}
    },
	/**
     * 获取菜单的高度，用于设置气泡窗口的宽度
     *
     * @memberof EarthMenu.prototype
     *
     * @type {EarthMenu}
     * @readonly
     */
    height : {
    	get : function() {
    		if (this.direction == MenuConst.VERTICAL) {
    			return this.children.length * MenuConst.ITEM_V_HEIGHT;
    		}
    		else {
    			return this.children.length * MenuConst.ITEM_H_HEIGHT/2;
    		}
    	}
    },
    /**
     * 获取三维球去除底部留空的高度，所得值为菜单可显示的最大高度
     *
     * @memberof EarthMenu.prototype
     *
     * @type {EarthMenu}
     * @readonly
     */
    earthHeight : {
    	get : function() {
    		return Math.ceil($("#earthDiv").height()) * getZoom();
    	}
    },
    /**
     * 获取菜单气泡窗口的高度
     *
     * @memberof EarthMenu.prototype
     *
     * @type {EarthMenu}
     * @readonly
     */
    balloonHeight : {
    	get : function() {
    		var menuHeight = this.height + MenuConst.BORDER_MARGIN;	// 菜单高度加上气泡的边框
    		var earthHeigh = this.earthHeight - MenuConst.BOTTOM_MARGIN;	//三维球去除底部留空的高度
    		if (earthHeigh < menuHeight) {		//窗口高度小于比菜单内容高度，则按每项高度来设置菜单高度，使其刚好可以显示整数个菜单项
    			var itemHeight;
    			if (this.direction == MenuConst.VERTICAL) {
    				itemHeight = MenuConst.ITEM_V_HEIGHT;
    			}
    			else {
    				itemHeight = MenuConst.ITEM_H_HEIGHT;
    			}
    			return Math.floor((earthHeigh - MenuConst.BORDER_MARGIN - MenuConst.SCROLL_BTN_HEIGHT) / itemHeight) * itemHeight +
    				MenuConst.BORDER_MARGIN + MenuConst.SCROLL_BTN_HEIGHT;	//取整数个菜单项的高度
    		}
    		else {
    			return menuHeight;
    		}
    	}
    },
	/**
     * 获取菜单的显示位置，用于设置气泡窗口的位置
     * 菜单的位置以其父菜单的位置为基准，再加上父菜单的宽度
     * @memberof EarthMenu.prototype
     *
     * @type {EarthMenu}
     * @readonly
     */
    position : {
    	get : function() {
    		if (this._position != undefined && this._position != null) {
    			return this._position;
    		}
    		var pos = {x : this.balloonWidth / 2, y : 0};
    		if (this.parent != undefined && this.parent != null) {
    			var parentpos = this.parent.position;
    			// 减去html balloon有22px的边框（但边框是不显示的，在球内实际是空白），但留6px作为菜单之间的空隙
    			pos.x += parentpos.x + this.parent.balloonWidth / 2 - MenuConst.BORDER_MARGIN + MenuConst.MENU_GAP;
    			pos.y = parentpos.y;
    		}
    		this._position = pos;
    		return pos;
    	}
    },
	/**
     * 设置获取菜单显示状态
     * 
     * @memberof EarthMenu.prototype
     *
     * @type {EarthMenu}
     */
    isClicked : {
    	get : function() {
    		return this._status;
    	},
    	set : function(value) {
    		this._status = value;
    	}
    },
	/**
     * 获取菜单是叶子节点，还是菜单节点，菜单节点点击时弹出子菜单，叶子节点点击时进行功能处理
     * 
     * @memberof EarthMenu.prototype
     *
     * @type {EarthMenu}
     */
    isLeaf : {
    	get : function() {
    		return this.children.length == 0;
    	}
    },
	/**
     * 设置获取菜单在气泡窗口内的图层
     * 
     * @memberof EarthMenu.prototype
     *
     * @type {EarthMenu}
     */
    div : {
    	get : function() {
    		return this._menuDiv;
    	},
    	set : function(value) {
    		this._menuDiv = value;
    	}
    },
	/**
     * 设置获取菜单的气泡窗口内的缩放比例
     * 
     * @memberof EarthMenu.prototype
     *
     * @type {EarthMenu}
     */
    zoom : {
    	get : function() {
    		return this._zoom;
    	},
    	set : function(value) {
    		this._zoom =  value;
    	}
    },
	/**
     * 设置获取菜单级别
     * 
     * @memberof EarthMenu.prototype
     *
     * @type {EarthMenu}
     */
    level : {
    	get : function() {
    		return this._level;
    	},
    	set : function(value) {
    		this._level =  value;
    	}
    }
});

/**
 * 菜单加载
 * 
 * @memberof EarthMenu.prototype
 *
 * @type {EarthMenu}
 */
EarthMenu.prototype.loadMenu = function(menuConfig) {
	this.id = 0;
	this.name = "root";	// root node
	this.title = '功能菜单';
	this.direction = MenuConst.VERTICAL;
	this.level = 0;	//root 为0级，子菜单依次递增
	this.loadItems(menuConfig, this);
}

/**
 * 子菜单项加载
 * 
 * @memberof EarthMenu.prototype
 *
 * @type {EarthMenu}
 */
EarthMenu.prototype.loadItems = function(menuItems, parent) {
	for (var i = 0; i < menuItems.length; i++) {
		var item = menuItems[i];
		var menu = new EarthMenu();
		menu.index = i ;
		menu.id = item.id;
		menu.name = item.name;
		menu.title = item.title;
		menu.image = item.src;
		menu.parent = parent;
		menu.level = parent.level + 1;
		// alert(menu.id);
		// alert(menu.level);
		var childItems = item.item;
		if (childItems != undefined) {
			if (menu.level < 2) {	// 仅显示二级菜单，三级菜单在图层中
				menu.loadItems(childItems, menu);
			}
			else {
				menu.childItems = childItems;	// 二级菜单中含有子项的，不加载为菜单，仅保存其子项，在图层面板中显示其三级子期间项
			}
		}
		this.children.push(menu);
		EarthMenu.addMenuNode(menu.id, menu);
	}
}

EarthMenu.prototype.menuClicked = function(menuID) {
	// alert(menuID);
	try {
		if (typeof window[menuID + "Clicked"] == "function") {
			// EarthMenu.earthMenuRoot.hideChildrenMenu();	//菜单点击后收起子菜单
			this.isClicked = !this.isClicked;	//如果菜单是点击状态，两次点击取消点击状态
			window[menuID + "Clicked"](menuID);	//这里需要注意，一定要先设置状态，再调用相应功能处理函数，功能处理中会判断菜单状态
		} else {
			alert("请先定义" + menuID + "Clicked方法");
		}
	} catch (e) {
		alert(e);
		alert(menuID + "Clicked方法异常！");
	}
}

EarthMenu.prototype.childMenuClicked = function(menuID) {
	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if (child.id == menuID) {
			if (child.isLeaf) {
				child.menuClicked(menuID);
			}
			else {
				child.showMenu();
			}
		}
		else {
			child.hideMenu();
		}
	}
}

/**
 * 子菜单隐藏，同时会释放气泡窗口资源
 * 
 * @memberof EarthMenu.prototype
 *
 * @type {EarthMenu}
 */
EarthMenu.prototype.hideChildrenMenu = function() {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].hideMenu();
	}
}

/**
 * 菜单及其子菜单隐藏，同时会释放气泡窗口资源
 * 
 * @memberof EarthMenu.prototype
 *
 * @type {EarthMenu}
 */
EarthMenu.prototype.hideMenu = function() {
	if (this.isLeaf || !this.isClicked) {
		return;
	}
	this.hideChildrenMenu();
	var balloon = this.htmlBalloon;
	if (balloon != undefined && balloon != null) {
		balloon.DestroyObject();
		this.htmlBalloon = undefined;
	}
	this.isClicked = false;
}

/**
 * 创建显示菜单气泡窗口
 * 
 * @memberof EarthMenu.prototype
 *
 * @type {EarthMenu}
 */
EarthMenu.prototype.showMenu = function() {
	if (this.isClicked) {
		this.hideMenu();	//
		return;
	}
	else {
		var pos = this.position;
		var balloon = LayerManagement.earth.Factory.CreateHtmlBalloon(LayerManagement.earth.Factory.CreateGuid(), this.title);
		balloon.SetScreenLocation(pos.x, pos.y);
		balloon.SetRectSize(this.balloonWidth, this.balloonHeight);
		balloon.SetIsAddCloseButton(false);
		balloon.SetIsAddMargin(false);
		balloon.SetIsAddBackgroundImage(true);
		balloon.SetIsTransparence(false);
		balloon.SetBackgroundAlpha(0);
		//balloon.SetBackgroundRGB(0x2167A3);
		var windowUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
		var url = windowUrl + '/earthMenu.html';
		var that = this;
		LayerManagement.earth.Event.OnDocumentReadyCompleted = function(guid) {
			if (guid == balloon.guid) {
				//resizeEarthToolWindow();
				//refreshEarthMenu();
				that.setBalloonParameters();
				that.setBalloonContents();
			}
		}
		balloon.ShowNavigate(url);
		this.htmlBalloon = balloon;
		this.isClicked = true;
	}
}
/**
 * 子菜单设置大小
 * 
 * @memberof EarthMenu.prototype
 *
 * @type {EarthMenu}
 */
EarthMenu.prototype.resizeChildrenMenu = function(height) {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].resizeMenu(height);
	}
}
/**
 * 根据三维球的高度重新设置菜单高度
 * 目前仅设置高度，宽度不做调整
 * 
 * @param height 参数为0，则采用默认计算的高度设置，大于0则设置为height指定高度
 * @memberof EarthMenu.prototype
 *
 * @type {EarthMenu}
 */
EarthMenu.prototype.resizeMenu = function(height) {
	if (this.isLeaf || !this.isClicked) {
		return;
	}
	this.resizeChildrenMenu(height);
	var balloonHeight = this.balloonHeight;
	if (height != undefined && height != 0 && balloonHeight > height) {
		balloonHeight = height;
	}
	this.htmlBalloon.SetRectSize(this.balloonWidth, balloonHeight);
	this.setBalloonParameters();
}

/**
 * 设置气泡窗口参数及回调函数
 * 
 * @memberof EarthMenu.prototype
 *
 * @type {EarthMenu}
 */
EarthMenu.prototype.setBalloonParameters = function() {
	var that = this;
	var balloon = this.htmlBalloon;
	var parameter = {};
	parameter.updateEarthMenuDiv = function (div) {
		that.div = div;
	}
	parameter.earthMenuHeight = this.height;// Math.floor((earthToolHeight - 32) / menuZoom);
	parameter.updateMenuZoom = function (zoom) {
		that.zoom = zoom;
	}
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
EarthMenu.prototype.setBalloonContents = function() {
	var balloon = this.htmlBalloon;
	var div = this.div;
	if (balloon != undefined && div != undefined) {
		var innerHtml = this.childrenHtml;
		/*innerHtml += '<div id="prevBtn"><img src="images/earthTools/prevBtn.png" /></div>' +
			'<div id="nextBtn"><img src="images/earthTools/nextBtn.png" /></div>';	//添加滚动按钮
		*/
		div.html(innerHtml);
		//this.innerHtml = innerHtml;
		//var parameter = {};
		//balloon.InvokeScript('setScrollBtn', parameter);
		this.setClickCallback();
	}
}
/**
 * 设置气泡窗口内菜单项点击的回调函数
 * 
 * @memberof EarthMenu.prototype
 *
 * @type {EarthMenu}
 */
EarthMenu.prototype.setClickCallback = function() {
	var balloon = this.htmlBalloon;
	if (balloon != undefined && this.div != undefined) {
		var that = this;
		for (var i = 0; i < this.children.length; i++) {
			this.div.find("#" + this.children[i].id).click(function() {
				that.childMenuClicked($(this).attr("id"));
			});
		}
	}
}
/**
 * 显示和隐藏菜单，但不释放菜单气泡窗口
 * 
 * @para isVisible true显示，false隐藏
 * @memberof EarthMenu.prototype
 *
 * @type {EarthMenu}
 */
EarthMenu.prototype.setIsVisible = function(isVisible) {
	if (this.isLeaf) return;
	
	var balloon = this.htmlBalloon;
	if (balloon != undefined && balloon != null) {
		balloon.SetIsVisible(isVisible);
	}
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].setIsVisible(isVisible);
	}
}


/**
 * 地球状态，球内相关状态的处理
 * 如地形透明、地下浏览状态等
 *
 * @type {EarthMenu}
 */
function EarthStatus() {
	this._status = false;
} 



