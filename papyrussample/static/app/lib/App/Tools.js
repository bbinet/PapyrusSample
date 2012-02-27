/*
 * @include App/Edit.js
 * @include App/Query.js
 * @include App/Search.js
 * @include App/Print.js
 */

Ext.namespace('App');

/**
 * Constructor: App.Tools
 * Creates an {Ext.Toolbar} with tools. Use the "tbar" or "bbar" property
 * to get a reference to the top or bottom toolbar.
 *
 * Parameters:
 * mapPanel - {GeoExt.MapPanel} The map panel instance.
 */
App.Tools = function(mapPanel, layer) {

    // Private

    /**
     * Method: getTbarItems
     * Return the top toolbar items.
     *
     * Parameters:
     * mapPanel - {GeoExt.MapPanel} The map panel instance.
     *
     * Returns:
     * {Array} An array of toolbar items.
     */
    var getTbarItems = function(mapPanel, layer) {

        var defaults = {
            enableToggle: true,
            toggleGroup: 'mode'
        };

        var infoButton = (new App.Query(mapPanel, defaults)).button;
        var editButton = (new App.Edit(mapPanel.map, layer, defaults)).button;


        var searchButton = (new App.Search(
            mapPanel,
            defaults,
            {
                labelAlign: 'top',
                anchor: '90%',
                border: false,
                unstyled: true,
                defaults: {
                    anchor: '100%'
                }
            }
        )).button;

        var printButton = (new App.Print(
            mapPanel,
            defaults,
            {
                labelAlign: 'top',
                anchor: '90%',
                border: false,
                unstyled: true,
                defaults: {
                    anchor: '100%'
                }
            }
        )).button;

        return ['->',
            infoButton,
            editButton,
            searchButton,
            printButton
        ];
    };

    // Public

    Ext.apply(this, {

        /**
         * APIProperty: tools
         * {Array} The list of items to add to a toolbar
         */
        tools: null
    });

    // Main
    this.tools = getTbarItems(mapPanel, layer);
};
