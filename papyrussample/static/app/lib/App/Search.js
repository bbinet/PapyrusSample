/**
 * @include OpenLayers/Format/GeoJSON.js
 * @include OpenLayers/Format/QueryStringFilter.js
 * @include OpenLayers/Protocol/HTTP.js
 * @include OpenLayers/Layer/Vector.js
 * @include OpenLayers/StyleMap.js
 * @include OpenLayers/Filter/Logical.js
 * @include GeoExt/widgets/form/FormPanel.js
 * @include GeoExt/widgets/form.js
 * @include GeoExt.ux/FeatureBrowser.js
 * @include App/ToolButton.js
 * @include App/ToolWindow.js
 * @include App/main.js
 */

Ext.namespace('App');

/**
 * Constructor: App.Edit
 *
 * Parameters:
 * mapPanel - {GeoExt.MapPanel} The mapPanel.
 * buttonOptions - {object} The options to be applied to the App.ToolButton.
 */
App.Search = function(mapPanel, buttonOptions, formPanelOptions) {

    // Private

    /**
     *
     */
    var formPanel = null;

    /**
     * Property: tip
     * {Ext.Tip} The tip including the query results.
     */
    var tip = null;

    /**
     * Property: vectorLayer
     * {OpenLayers.Layer.Vector} The vector layer to display results.
     */
    var vectorLayer = null;

    /**
     *
     */
    var activate = function() {
        mapPanel.map.addLayer(vectorLayer);
    };

    /**
     *
     */
    var deactivate = function() {
        tip.hide();
        formPanel.getForm().reset();
        vectorLayer.destroyFeatures();
        // there's a bug in OpenLayers where removing a layer that has
        // already been removed causes an error, work around it
        if (OpenLayers.Util.indexOf(mapPanel.map.layers, vectorLayer) >= 0) {
            mapPanel.map.removeLayer(vectorLayer);
        }
    };

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
        if (features && features.length > 0) {
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
                tpl:  new Ext.Template(
                    '{type} <b>{name}</b>',
                    '<div class="rating{rating}">',
                    '<img src="', App.Ext_BLANK_IMAGE_URL, '" />',
                    '</div>'
                ),
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

        var toolWindow = new App.ToolWindow({
            width: 250,
            items: formPanel
        });

        var btn = new App.ToolButton(Ext.apply({
            text: 'search',
            iconCls: 'search',
            window: toolWindow
        }, buttonOptions));
        btn.on('toggle', function(button) {
            if (button.pressed) {
                activate();
            }
            else {
                deactivate();
            }
        });

        return btn;
    };

    tip = new Ext.Tip({
        header: true,
        width: 200
    });

    vectorLayer = new OpenLayers.Layer.Vector('search', {
        styleMap: new OpenLayers.StyleMap({
            'default': App.styleDefault
        }),
        displayInLayerSwitcher: false
    });

 
    formPanel = new GeoExt.form.FormPanel(Ext.apply({
        width: 220,
        protocol: new OpenLayers.Protocol.HTTP({
            url: App.poisURL,
            format: new OpenLayers.Format.GeoJSON()
        }),
        items: [{
            xtype: "textfield",
            name: "name__like",
            fieldLabel: "Name"
        }, {
            xtype: "combo",
            name: "type__eq",
            fieldLabel: "Type",
            store: new Ext.data.ArrayStore({
                fields: ['type'],
                data: [['Bar'], ['Cafe'], ['Fastfood'], ['Pub'], ['Restaurant']]
            }),
            displayField: 'type',
            valueField: 'type',
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true
        }, {
            xtype: "combo",
            name: "rating__eq",
            fieldLabel: "Rating",
            store: new Ext.data.ArrayStore({
                fields: ['rating'],
                data: [['0'], ['1'], ['2'], ['3'], ['4'], ['5']]
            }),
            allowBlank: true,
            displayField: 'rating',
            valueField: 'rating',
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true
        }],
        listeners: {
            actioncomplete: function(form, action) {
                showTip(action.response.features);
            }
        }
    }, formPanelOptions));

    formPanel.addButton({
        text: "search",
        handler: function() {
            this.search({
                wildcard: GeoExt.form.CONTAINS
            });
        },
        scope: formPanel
    });

    /**
     * APIProperty: button
     * {App.ToolButton} 
     */
    this.button = createButton();
};
