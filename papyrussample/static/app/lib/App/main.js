/*
 * @include OpenLayers/Map.js
 * @include OpenLayers/Layer/OSM.js
 * @include OpenLayers/Layer/WMS.js
 * @include OpenLayers/Layer/Vector.js
 * @include OpenLayers/Renderer/SVG.js
 * @include OpenLayers/Renderer/VML.js
 * @include OpenLayers/Strategy/BBOX.js
 * @include OpenLayers/Protocol/HTTP.js
 * @include OpenLayers/Format/GeoJSON.js
 * @include OpenLayers/StyleMap.js
 * @include OpenLayers/Control/Navigation.js
 * @include OpenLayers/Control/PanZoom.js
 * @include OpenLayers/Control/ArgParser.js
 * @include OpenLayers/Control/Attribution.js
 */

/*
 * This file represents the application's entry point. 
 */

var map;
window.onload = function() {
    OpenLayers.ImgPath = URLS.OpenLayers_ImgPath;

    map = new OpenLayers.Map("map", {
        projection: new OpenLayers.Projection("EPSG:900913"),
        maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34)
    });
    map.addLayer(new OpenLayers.Layer.OSM("Simple OSM Map"));
    map.addLayer(new OpenLayers.Layer.WMS("Pois",
        "http://localhost/cgi-bin/mapserv?map=/tmp/mapserver/app.map",
        {
            layers: "sustenance",
            transparent: true
        }, {
            singleTile: true
        }
    ));
    map.addLayer(new OpenLayers.Layer.Vector("Vector", {
        strategies: [new OpenLayers.Strategy.BBOX()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: URLS.pois_read_many,
            format: new OpenLayers.Format.GeoJSON()
        }),
        styleMap: new OpenLayers.StyleMap(
            OpenLayers.Util.applyDefaults(
                {fillColor: "blue", strokeColor: "blue"},
                OpenLayers.Feature.Vector.style["default"]))
    }));
    map.zoomToExtent(new OpenLayers.Bounds(657453, 5710249, 661266, 5712022));
};
