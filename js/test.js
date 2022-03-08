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
 *
 * @param deviceLayer 图层名称
 * @param name 设备名称
 * @returns {null}
 */
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
        //中心点
        lng: lng,
        lat: alt,
        //半径
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
 *
 * @param searchResult 搜索结果
 * @param name
 */
PowerPlant.showAllSearchDevice = function (searchResult, name) {
    //alert(searchResult.RecordCount);
    //高亮所有图层数据
    for (var i = 0; i < searchResult.RecordCount; i++) {
        var deviceObj = searchResult.GetLocalObject(i);
        var attraData = deviceObj.GetKey();
        PowerPlant.highlightObject(deviceObj);
    }
};

PowerPlant.highlightObject = function (obj) {
    obj.SetHighlightColor(parseInt('0x33ff0000'));
    obj.ShowHighLight();
    PowerPlant.highLightObjects.push(obj);
};
