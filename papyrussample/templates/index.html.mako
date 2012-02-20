<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <title>Pyramid / Papyrus workshop</title>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
    <link rel="shortcut icon" href="${request.static_url('papyrussample:static/favicon.ico')}" />
    <link rel="stylesheet" href="${request.static_url('papyrussample:static/app.css')}" type="text/css" />
</head>
<body>
    <div id="map"></div>
    <script type="text/javascript" src="http://openlayers.org/dev/OpenLayers.js"></script>
    <script>
    var map = new OpenLayers.Map("map", {
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
    map.zoomToExtent(new OpenLayers.Bounds(657453, 5710249, 661266, 5712022));
    </script>
</body>
</html>
