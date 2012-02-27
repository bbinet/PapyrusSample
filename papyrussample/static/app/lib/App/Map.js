/*
 * @include OpenLayers/Projection.js
 * @include OpenLayers/Map.js
 * @include OpenLayers/Layer/WMS.js
 * @include OpenLayers/Layer/OSM.js
 * @include OpenLayers/Control/Navigation.js
 * @include OpenLayers/Control/PanPanel.js
 * @include OpenLayers/Control/ZoomPanel.js
 * @include OpenLayers/Control/ArgParser.js
 * @include OpenLayers/Control/ScaleLine.js
 * @include GeoExt/widgets/MapPanel.js
 * @include App/Tools.js
 */

Ext.namespace('App');

/**
 * Constructor: App.Map
 * Creates a {GeoExt.MapPanel} internally. Use the "mapPanel" property
 * to get a reference to the map panel.
 *
 * Parameters:
 * options - {Object} Options passed to the {GeoExt.MapPanel}.
 */
App.Map = function(options) {

    // Private

    /**
     *
     */
    var poisLayer = null;

    /**
     * Method: getLayers
     * Returns the list of layers.
     *
     * Returns:
     * {Array({OpenLayers.Layer})} An array of OpenLayers.Layer objects.
     */
    var getLayers = function() {
        var osm = new OpenLayers.Layer.OSM();
        return [osm, poisLayer];
    };

    // Public

    Ext.apply(this, {

        /**
         * APIProperty: mapPanel
         * The {GeoExt.MapPanel} instance. Read-only.
         */
        mapPanel: null

    });

    // Main

    poisLayer = new OpenLayers.Layer.WMS(
        'POIS',
        App.mapservURL,
        {
            layers: ['sustenance'],
            transparent: true
        },
        {
            singleTile: true
        }
    );

    // create map
    // Note that the maxExtent come from the baseLayer.
    var mapOptions = {
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        units: "m",
        numZoomLevels: 18,
        maxResolution: 156543.0339,
        maxExtent: new OpenLayers.Bounds(
            -128 * 156543.0339,
            -128 * 156543.0339,
            128 * 156543.0339,
            128 * 156543.0339
        ),
        theme: null, // or OpenLayers will attempt to load it default theme
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.PanPanel(),
            new OpenLayers.Control.ZoomPanel(),
            new OpenLayers.Control.ArgParser(),
            new OpenLayers.Control.ScaleLine()
        ]
    };
    var map = new OpenLayers.Map(mapOptions);
    map.addLayers(getLayers());

    // create map panel
    options = Ext.apply({
        map: map,
        // center the map to the "Chambéry" area
        extent: OpenLayers.Bounds.fromString(
            "657453.98942,5710249.694936,661266.286205,5712022.078529"),
        tbar: new Ext.Toolbar(),
        stateId: "map",
        prettyStateKeys: true
    }, options);
    this.mapPanel = new GeoExt.MapPanel(options);

    var toolbar = this.mapPanel.getTopToolbar();
    toolbar.add(new App.Tools(this.mapPanel, poisLayer).tools);
    toolbar.doLayout();

};
