/*
 * @include App/Map.js
 * @include OpenLayers/Feature/Vector.js
 */

/*
 * This file represents the application's entry point. 
 * OpenLayers and Ext globals are set, and the page
 * layout is created.
 */

window.onload = function() {

    /*
     * Setting of OpenLayers global vars.
     */
    OpenLayers.Lang.setCode(OpenLayers.Util.getParameters().lang || "en");
    OpenLayers.Number.thousandsSeparator = ' ';
    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
    OpenLayers.ImgPath = App.OpenLayers_ImgPath;
    App.styleDefault = OpenLayers.Util.applyDefaults({
        graphicName: 'square',
        strokeColor: '#555',
        fillColor: '#555'
    }, OpenLayers.Feature.Vector.style['default']);

    /*
     * Setting of Ext global vars.
     */
    Ext.BLANK_IMAGE_URL = App.Ext_BLANK_IMAGE_URL;
    Ext.QuickTips.init();

    /*
     * Initialize the application.
     */
    
    var mapPanel = (new App.Map({
    })).mapPanel;

    mapPanel.setHeight(Ext.get('map').getHeight());
    mapPanel.render('map');
};
