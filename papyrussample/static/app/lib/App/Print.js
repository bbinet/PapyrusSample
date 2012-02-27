/*
 * @include GeoExt/widgets/Action.js
 * @include GeoExt/data/PrintProvider.js
 * @include GeoExt/plugins/PrintProviderField.js
 * @include GeoExt.ux/SimplePrint.js
 * @include OpenLayers/Feature/Vector.js
 * @include OpenLayers/Geometry/Polygon.js
 * @include OpenLayers/Layer/Vector.js
 * @include OpenLayers/Renderer/SVG.js
 * @include OpenLayers/Renderer/VML.js
 * @include OpenLayers/Control/TransformFeature.js
 * @include App/ToolButton.js
 * @include App/ToolWindow.js
 */
Ext.namespace('App');

/**
 * Constructor: App.Print
 *
 * Parameters:
 * mapPanel - {GeoExt.MapPanel} The map panel the print panel is connect to.
 * buttonOptions - {Object} Options for the button
 * printPanelOptions - {Object}
 */
App.Print = function(mapPanel, buttonOptions, printPanelOptions) {

    // Private

    /**
     * Property: print
     * {GeoExt.ux.SimplePrint} The simple print component.
     */
    var print;

    /**
     * Property: printProvider
     * {GeoExt.data.PrintProvider} The print provider.
     */
    var printProvider;

    /**
     * Method: populateWin
     * Populate the print window. Called only once, when
     *      the print caps are received.
     */
    var populateWin = function() {
        printPanelOptions = Ext.apply({
            width: 220,
            mapPanel: mapPanel,
            printProvider: printProvider,
            items: [{
                xtype: 'textfield',
                name: 'title',
                fieldLabel: OpenLayers.i18n("Print.titlefieldlabel"),
                value: OpenLayers.i18n("Print.titlefieldvalue"),
                plugins: new GeoExt.plugins.PrintProviderField()
            }, {
                xtype: 'textarea',
                name: 'comment',
                fieldLabel: OpenLayers.i18n("Print.commentfieldlabel"),
                value: OpenLayers.i18n("Print.commentfieldvalue"),
                plugins: new GeoExt.plugins.PrintProviderField()
            }],
            dpiText: OpenLayers.i18n("Print.dpifieldlabel"),
            scaleText: OpenLayers.i18n("Print.scalefieldlabel"),
            hideRotation: true,
            printText: OpenLayers.i18n("Print.printbuttonlabel"),
            creatingPdfText: OpenLayers.i18n("Print.waitingmessage")
        }, printPanelOptions); 
    
        print = new GeoExt.ux.SimplePrint(printPanelOptions);
        print.hideExtent();
        window.add(print);
        window.doLayout();
    };

    // Main

    printProvider = new GeoExt.data.PrintProvider({
        url: App.printURL,
        autoLoad: true,
        baseParams: {
            url: App.printURL
        },
        listeners: {
            loadcapabilities: populateWin
        }
    });

    var window = new App.ToolWindow({width: 250});

    var button = new App.ToolButton(Ext.apply({
        text: OpenLayers.i18n("print"),
        iconCls: 'print',
        tooltip: OpenLayers.i18n("Print.printbuttonlabel"),
        window: window
    }, buttonOptions));

    button.on('toggle', function(button) {
        if (!print) {
            // this is just to avoid getting an error when
            // paster is used
            return;
        }
        print.setDisabled(!button.pressed);
        if (button.pressed) {
            print.printPage.fit(mapPanel.map, {mode: 'screen'});
        }
    });

    /**
     * APIProperty: button
     * {App.ToolButton} 
     */
    this.button = button; 
};
