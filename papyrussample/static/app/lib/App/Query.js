/*
 * @include OpenLayers/Control/GetFeature.js
 * @include OpenLayers/Format/GeoJSON.js
 * @include OpenLayers/Format/QueryStringFilter.js
 * @include OpenLayers/Protocol/HTTP.js
 * @include OpenLayers/Layer/Vector.js
 * @include OpenLayers/StyleMap.js
 * @include GeoExt/widgets/Action.js
 * @include GeoExt.ux/FeatureBrowser.js
 * @include App/ToolButton.js
 * @include App/ToolWindow.js
 * @include App/main.js
 */

Ext.namespace('App');

/**
 * Class: App.Query
 * Map queries (with WMS GetFeatureInfo)
 *
 * Parameters:
 * mapPanel - {GeoExt.MapPanel} The mapPanel.
 * buttonOptions - {object} The options to be applied to the GeoExt.Action.
 */
App.Query = function(mapPanel, buttonOptions) {

    // Private

    /**
     * Property: tip
     * {Ext.Tip} The tip including the query results.
     */
    var tip = new Ext.Tip({
        header: true,
        width: 200
    });

    /**
     * Property: vectorLayer
     * {OpenLayers.Layer.Vector} The vector layer to display results.
     */
    var vectorLayer = null;

    /**
     * Property: fbTemplate
     * {Ext.Template} A template to use for the FeatureBrowser
     */
    var fbTemplate = new Ext.Template(
        '{type} <b>{name}</b>',
        '<div class="rating{rating}">',
            '<img src="', App.Ext_BLANK_IMAGE_URL, '" />',
        '</div>'
    );

    /**
     * Method: showTip
     * Display the tip with the given features.
     *
     * Parameters:
     * features - {Array(OpenLayers.Feature.Vector)} The features.
     */
    var showTip = function(features) {
        vectorLayer.removeAllFeatures();
        tip.removeAll();
        if (features) {
            Ext.each(features, function(feature, index) {
                if (!feature.geometry && feature.bounds) {
                    feature.geometry = feature.bounds.toGeometry();
                }
            });
            var browser = new GeoExt.ux.FeatureBrowser({
                features: features,
                border: false,
                bodyStyle: "padding: 6px;",
                autoScroll: true,
                height: 80,
                counterText: OpenLayers.i18n("Query.countertext"),
                skippedFeatureAttributes: ["oid"],
                tpl: fbTemplate,
                listeners: {
                    'featureselected': function(panel, feature) {
                        for (var i = 0; i < features.length; i++) {
                            vectorLayer.drawFeature(features[i], 'default');
                        }
                        vectorLayer.drawFeature(feature, 'select');
                        alignTip();
                    }
                }
            });
            vectorLayer.addFeatures(features);
            tip.add(browser);
        } else {
            tip.setTitle('');
            tip.add({
                xtype: 'box',
                html: 'No result found'
            });
        }
        tip.show();
        tip.doLayout();
        alignTip();
    };

    /**
     * Method: alignTip
     * Place the tip at the correct location in the map panel.
     */
    var alignTip = function() {
        tip.getEl() && tip.getEl().alignTo(
            mapPanel.body,
            "br-br",
            [-5, -5],
            true
        );
    };

    /**
     * Method: createButton
     * Create the button.
     *
     * Returns:
     * {App.ToolButton}
     */
    var createButton = function() {
        var action = new GeoExt.Action(Ext.apply({
            control: createControl(),
            map: mapPanel.map,
            text: 'info',
            iconCls: 'info',
            action: action,
            tooltip: OpenLayers.i18n("Query.actiontooltip"),
            window: new App.ToolWindow({
                width: 300,
                items: [
                    {
                        xtype: 'box',
                        html: OpenLayers.i18n('Query.help')
                    }
                ]
            })
        }, buttonOptions));

        return new App.ToolButton(action);
    };

    /**
     * Method: createLayer
     * Create the vector layer.
     */
    var createLayer = function() {
        vectorLayer = new OpenLayers.Layer.Vector('info', {
            styleMap: new OpenLayers.StyleMap({
                'default': App.styleDefault
            }),
            displayInLayerSwitcher: false
        });
        mapPanel.map.addLayer(vectorLayer);
    };

    /**
     * Method: destroyLayer
     * Destroy the vector layer.
     */
    var destroyLayer = function() {
        vectorLayer.destroy();
        vectorLayer = null;
    };


    /**
     * Method: createControl
     * Create the WMS GFI control.
     *
     * Returns:
     * {OpenLayers.Control.WMSGetFeatureInfo}
     */
    var createControl = function() {
        var protocol = new OpenLayers.Protocol.HTTP({
            url: App.poisURL,
            format: new OpenLayers.Format.GeoJSON()
        });

        return new OpenLayers.Control.GetFeature({
            protocol: protocol,
            box: true,
            click: true,
            single: false,
            clickTolerance: 10,
            eventListeners: {
                activate: function() {
                    createLayer();
                },
                beforefeatureselected: function() {
                    tip.hide();
                },
                featuresselected: function(obj) {
                    showTip(obj.features);
                },
                clickout: function() {
                    showTip(false);
                },
                deactivate: function() {
                    tip.hide();
                    destroyLayer();
                }
            }
        });
    };

    // Main

    /**
     * APIProperty: button
     * {App.ToolButton} 
     */
    this.button = createButton();
};

