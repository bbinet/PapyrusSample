/*
 * @include OpenLayers/Layer/Vector.js
 * @include OpenLayers/Renderer/SVG.js
 * @include OpenLayers/Renderer/VML.js
 * @include OpenLayers/Control/DrawFeature.js
 * @include OpenLayers/Control/SelectFeature.js
 * @include OpenLayers/Control/ModifyFeature.js
 * @include OpenLayers/Format/WFSDescribeFeatureType.js
 * @include OpenLayers/Handler/Point.js
 * @include OpenLayers/Protocol/HTTP.js
 * @include OpenLayers/Strategy/Fixed.js
 * @include OpenLayers/Strategy/Save.js
 * @include GeoExt/widgets/Action.js
 * @include GeoExt.ux/FeatureEditorGrid.js
 * @include App/ToolButton.js
 * @include App/ToolWindow.js
 */

Ext.namespace('App');

/**
 * Constructor: App.Edit
 *
 * Parameters:
 * map - {OpenLayers.Map} The map.
 * layer - {OpenLayers.Layer.WMS} The WMS layer to refresh upon editing.
 * buttonOptions - {object} The options to be applied to the App.ToolButton.
 */
App.Edit = function(map, layer, buttonOptions) {


    // Private

    /**
     *
     */
    var button = null;

    /**
     *
     */
    var vectorLayer = null;

    /**
     *
     */
    var saveStrategy = null;
 
    /**
     *
     */
    var attrWin = null;

    /**
     *
     */
    var selectFeature = null;

    /**
     *
     */
    var drawFeature = null;

    /**
     *
     */
    var activate = function() {
        map.addLayer(vectorLayer);
        map.addControl(drawFeature);
        map.addControl(selectFeature);
        selectFeature.activate();
    };

    /**
     *
     */
    var deactivate = function() {
        selectFeature.deactivate();
        map.removeControl(selectFeature);
        drawFeature.deactivate();
        map.removeControl(drawFeature);
        vectorLayer.destroyFeatures();
        // there's a bug in OpenLayers where removing a layer that has
        // already been removed causes an error, work around it
        if (OpenLayers.Util.indexOf(map.layers, vectorLayer) >= 0) {
            map.removeLayer(vectorLayer);
        }
    };

    /**
     * Method: createButton
     * Create the button for activating/deactivating editing.
     *
     */
    var createButton = function() {
        var btn = new App.ToolButton(Ext.apply({
            text: 'editing',
            iconCls: 'editing',
            window: new App.ToolWindow({
                width: 160,
                items: createTbar(),
                listeners: {
                    'beforehide': function() {
                        var editorGrid = getEditorGrid();
                        if (editorGrid && editorGrid.dirty) {
                            Ext.Msg.alert(
                                'Warning',
                                'Save or cancel changes before leaving ' +
                                'editing mode');
                            btn.toggle(true);
                            return false;
                        }
                        closeAttrWin();
                        deactivate();
                        btn.toggle(false);
                    },
                    'show': function() {
                        activate();
                    }
                }
            })
        }, buttonOptions));
        return btn;
    };

    /**
     *
     */
    var createTbar = function() {
        var items = [];
        items.push(new GeoExt.Action({
            text: "draw",
            control: drawFeature,
            iconCls: 'edit-add',
            toggleGroup: "edittools",
            allowDepress: false
        }));
        items.push(new GeoExt.Action({
            text: "select",
            control: selectFeature,
            iconCls: 'edit-modify',
            toggleGroup: "edittools",
            allowDepress: false
        }));
        return new Ext.Toolbar({items: items, cls: "editing-toolbar"});
    };

    /**
     *
     */
    var createAttrWin = function(feature) {
        var store = new GeoExt.data.AttributeStore({
            feature: feature,
            fields: ["name", "type", "restriction", "label"],
            data: [{
                name: "name",
                label: "Name",
                type: "text"
            }, {
                name: "rating",
                label: "Rating",
                value: 0,
                type: {
                    xtype: 'combo',
                    store: new Ext.data.ArrayStore({
                        fields: ['rating'],
                        data: [[0], [1], [2], [3], [4], [5]]
                    }),
                    displayField: 'rating',
                    valueField: 'rating',
                    mode: 'local',
                    editable: false,
                    forceSelection: true,
                    triggerAction: 'all',
                    selectOnFocus: true
                }
            }, {
                name: "type_desc",
                label: "Type description",
                type: "text"
            }, {
                name: "theme",
                label: "Theme",
                type: "text"
            }, {
                name: "type",
                label: "Type",
                type: {
                    xtype: 'combo',
                    store: new Ext.data.ArrayStore({
                        fields: ['type'],
                        data: [[ 'Bar' ], [ 'Cafe' ], [ 'Fastfood' ], [ 'Pub' ], [ 'Restaurant' ]]
                    }),
                    displayField: 'type',
                    valueField: 'type',
                    mode: 'local',
                    editable: false,
                    forceSelection: true,
                    triggerAction: 'all',
                    selectOnFocus: true
                },
                value: 'Restaurant'
            }]
        });
        var editorGrid = new GeoExt.ux.FeatureEditorGrid({
            nameField: "label",
            store: store,
            forceValidation: true,
            allowSave: true,
            allowCancel: true,
            allowDelete: true,
            viewConfig: {
                forceFit: true
            },
            listeners: {
                done: function(panel, e) {
                    // we need to destroy the editor grid (included in the attr
                    // window) before destroying its feature, or the editor
                    // grid won't be able to unregister its featuremodified
                    // listener, which will cause problem
                    closeAttrWin();
                    var feature = e.feature;
                    if (feature.fid != null ||
                        feature.state === OpenLayers.State.INSERT) {
                        saveStrategy.save();
                    } else if (feature.state === OpenLayers.State.DELETE) {
                        // the feature is unknown to the server and its state
                        // is DELETE, we can therefore silently discard it
                        vectorLayer.destroyFeatures([feature]);
                    }
                    selectFeature.activate();
                },
                cancel: function(panel, e) {
                    var feature = e.feature, modified = e.modified;
                    panel.cancel();
                    closeAttrWin();
                    if (feature.state === OpenLayers.State.INSERT) {
                        feature.layer.destroyFeatures([feature]);
                    }
                    // we call cancel() ourselves so return false here
                    return false;
                }
            }
        });
        attrWin = new Ext.Window({
            layout: 'fit',
            items: editorGrid,
            height: 200,
            width: 300,
            closeAction: 'hide',
            listeners: {
                'hide': closeAttrWin
            }
        });
        getEditingTbar().disable(); // disable the editing tbar
                                    // when the attr window is
                                    // displayed
        attrWin.show();
        feature.layer.drawFeature(feature, "select");
    };

    /**
     *
     */
    var closeAttrWin = function() {
        // avoid reentrance
        if(!arguments.callee._in) {
            arguments.callee._in = true;
            if (attrWin) {
                var editorGrid = getEditorGrid();
                if (editorGrid) {
                    // we created the attribute store so the editor
                    // grid won't destroy it for us
                    editorGrid.store.destroy();
                }
                attrWin.close();
                attrWin = null;
                getEditingTbar().enable(); // reenable the editing
                                           // tbar
            }
            selectFeature.unselectAll();
            delete arguments.callee._in;
        }
    };

    /**
     *
     */
    var getEditorGrid = function() {
        var editorGrid = null;
        if (attrWin && attrWin.items && attrWin.items.length > 0) {
            editorGrid = attrWin.items.get(0);
        }
        return editorGrid;
    };

    /**
     *
     */
    var getEditingTbar = function() {
        return button.window.items.get(0);
    };

    /*
     * Create the save strategy.
     */

    saveStrategy = new OpenLayers.Strategy.Save();
    saveStrategy.events.on({
        'success': function() {
            layer.redraw(true);
        },
        'fail': function() {
            // TODO: recreate the deleted feature
        }
    });

    /*
     * Create the vector layer.
     */

    vectorLayer = new OpenLayers.Layer.Vector("vector", {
        protocol: new OpenLayers.Protocol.HTTP({
            url: App.poisURL,
            format: new OpenLayers.Format.GeoJSON()
        }),
        strategies: [
            new OpenLayers.Strategy.Fixed(),
            saveStrategy
        ],
        styleMap: new OpenLayers.StyleMap({
            'default': App.styleDefault
        }),
        eventListeners: {
            beforefeatureadded: function(e) {
                var feature = e.feature;
                if (feature.fid == null) {
                    // feature drawn by the user, as opposed
                    // to received from the web service
                    closeAttrWin();
                    selectFeature.select(e.feature);
                }
            },
            beforefeatureselected: function(e) {
                createAttrWin(e.feature);
            },
            featureunselected: function(e) {
                closeAttrWin();
            }
        }
    });

    /*
     * Create the select feature and draw feature controls.
     */

    selectFeature = new OpenLayers.Control.SelectFeature(vectorLayer);
    drawFeature = new OpenLayers.Control.DrawFeature(
        vectorLayer, OpenLayers.Handler.Point);

    // Public

    /**
     * APIProperty: button
     * {Ext.Button} The button for activating/deactivating editing.
     */
    button = this.button = createButton();
};
