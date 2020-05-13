
/**
 * 作       者：StampGIS Team
 * 创建日期：2017年7月22日
 * 描        述：菜单配置文件
 * 注意事项：
 * 遗留bug：0
 * 修改日期：2017年11月8日
 ******************************************/

var STAMP = STAMP || {};
STAMP.menuConfig = {
    "menu": [
        {
            "id": "view",
            "name": "场景",
            "title": "场景",
            "icon": "icon-gongzuotaifuben",
            "close":"able",
            "item": [
                // {
                // 	"name": "飞行路径",
                // 	"title": "飞行路径",
                // 	"id": "ViewFlyMode",
                // 	"src": "images/tools/路径.png"
                // }, {
                // 	"id": "ViewPersonMode",
                // 	"name": "场景漫游",
                // 	"title": "场景漫游",
                // 	"src": "images/tools/漫游.png"
                // },
                {
                    "id": "surround",
                    "name": "环绕浏览",
                    "title": "环绕浏览",
                    "icon": "icon-xuanzhuan",
                    "close":"enable",
                },
                {
                    "id": "ViewRefersToNorth",
                    "name": "场景正北",
                    "title": "场景正北",
                    "icon": "icon-zhibeizhen",
                    "close":"enable",
                },
                {
                    "id": "topView",
                    "name": "场景俯视",
                    "title": "场景俯视",
                    "icon": "icon-fushi",
                    "close":"enable",
                },
                {
                    "name": "统计",
                    "title": "统计信息",
                    "id": "Statistics",
                    "icon": "icon-shujutongji",
                    "close":"able",
                }
                // {
                //     "id": "coordSearch",
                //     "name": "坐标查询",
                //     "title": "坐标查询",
                //     "src": "images/tools/坐标查询.png"
                // },
                // {
                // 	"id": "mCamera",
                // 	"name": "视频监控",
                // 	"title": "视频监控",
                // 	"src": "images/tools/监控.png"
                // }, {
                // 	"id": "GPS",
                // 	"name": "GPS",
                // 	"title": "GPS",
                // 	"src": "images/tools/GPS.png"
                // }, {
                // 	"id": "GPSTrack",
                // 	"name": "GPS监控",
                // 	"title": "GPS监控",
                // 	"src": "images/tools/GPS监控.png"
                // }, {
                // 	"id": "mScreenShot",
                // 	"name": "屏幕截图",
                // 	"title": "屏幕截图",
                // 	"src": "images/tools/截屏.png"
                // }, {
                // 	"id": "SpecialEffect",
                // 	"name": "特效",
                // 	"title": "特效",
                // 	"src": "images/tools/特效.png",
                // 	"item": [{
                // 		"title": "雨",
                // 		"src": "images/panelMenu/inactiveIcons/雨.png",
                // 		"srcd": "images/panelMenu/activeIcons/雨.png",
                // 		"id": "EffectRain",
                // 		"name": "雨"
                // 	}, {
                // 		"title": "雪",
                // 		"src": "images/panelMenu/inactiveIcons/雪.png",
                // 		"srcd": "images/panelMenu/activeIcons/雪.png",
                // 		"id": "EffectSnow",
                // 		"name": "雪"
                // 	}, {
                // 		"title": "雾",
                // 		"src": "images/panelMenu/inactiveIcons/雾.png",
                // 		"srcd": "images/panelMenu/activeIcons/雾.png",
                // 		"id": "EffectFog",
                // 		"name": "雾"
                // 	}]
                // }, {
                // 	"id": "dynamicObject",
                // 	"name": "动态特效",
                // 	"title": "动态特效",
                // 	"src": "images/tools/动态对象.png",
                // 	"item": [{
                // 		"id": "fire",
                // 		"name": "火",
                // 		"title": "火",
                // 		"src": "images/panelMenu/inactiveIcons/火.png",
                // 		"srcd": "images/panelMenu/activeIcons/火.png"
                // 	}, {
                // 		"id": "mist",
                // 		"name": "烟",
                // 		"title": "烟",
                // 		"src": "images/panelMenu/inactiveIcons/烟.png",
                // 		"srcd": "images/panelMenu/activeIcons/烟.png"
                // 	}, {
                // 		"id": "dWater",
                // 		"name": "动态水面",
                // 		"title": "动态水面",
                // 		"src": "images/panelMenu/inactiveIcons/动态水面.png",
                // 		"srcd": "images/panelMenu/activeIcons/动态水面.png"
                // 	}]
                // }, {
                // 	"id": "layerTrans",
                // 	"name": "模型透明",
                // 	"title": "模型透明",
                // 	"src": "images/tools/模型透明.png"
                // }, {
                // 	"id": "systemSetting",
                // 	"name": "工程设置",
                // 	"title": "工程设置",
                // 	"src": "images/icon/工程.png"
                // }
            ]
        },
        // {
        //     "id": "query",
        //     "name": "查询",
        //     "title": "查询",
        //     "src": "images/icon/查询.png",
        //     "item": [{
        //         "id": "powerPlant",
        //         "name": "属性查询",
        //         "title": "属性查询",
        //         "src": "images/tools/属性查询.png"
        //     }, {
        //         "id": "keywordSearch",
        //         "name": "关键字查询",
        //         "title": "关键字查询",
        //         "src": "images/tools/关键字查询.png"
        //     },
        //     {
        //         "id": "coordSearch",
        //         "name": "坐标查询",
        //         "title": "坐标查询",
        //         "src": "images/tools/坐标查询.png"
        //     },
        //     {
        //         "id": "coordlocation",
        //         "name": "坐标定位",
        //         "title": "坐标定位",
        //         "src": "images/tools/坐标定位.png"
        //     }
        //     ]
        // },
        // {
        // 	"id": "deviceQuery",
        // 	"name": "设备",
        // 	"title": "发电设备",
        // 	"src": "images/icon/设备.png",
        // },
        {
            "id": "cameraQuery",
            "name": "监控",
            "title": "监控设备位置",
            "icon": "icon-shexiangtou",
            "close":"able",
        },
        {
            "id": "allCameraTree",
            "name": "监控设备树",
            "title": "监控设备树",
            "icon": "icon-ic_camera",
            "close":"enable",
        },
        {
            "id": "ndeviceQuery",
            "name": "设备",
            "title": "设备",
            "icon": "icon-shebei-2",
            "close":"enable",
        },
        // {
        //     "id": "workCamera",
        //     "name": "监控",
        //     "title": "生产区域监控",
        //     "src": "images/newIcon/white/jiankong.png"
        // },
        {
            "name": "漫游",
            "title": "漫游",
            "id": "wander",
            "icon": "icon-sport",
            "close":"able",
        },
        // {
        //     "name": "一键巡查",
        //     "title": "一键巡查",
        //     "id": "partol",
        //     "icon": "icon-gongzuotaifuben",
        // },
        {
            "name": "总览",
            "title": "总览",
            "id": "pandect",
            "icon": "icon-icon-test_",
            "close":"enable",
        },
        // {
        //     "id": "closeBallon",
        //     "name": "关闭",
        //     "title": "关闭气泡",
        //     "src": "images/icon/工程.png"
        // }
    ]
};











