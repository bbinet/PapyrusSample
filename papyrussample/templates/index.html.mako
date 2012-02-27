<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <title>Pyramid / Papyrus workshop</title>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
    <link rel="shortcut icon" type="image/x-icon" href="${request.static_url('papyrussample:static/app/images/favicon.ico')}" />
% if debug:
    <link rel="stylesheet" type="text/css" href="${request.static_url('papyrussample:static/lib/ext/Ext/resources/css/ext-all.css')}" />
    <link rel="stylesheet" type="text/css" href="${request.static_url('papyrussample:static/lib/ext/Ext/resources/css/xtheme-gray.css')}" />
    <link rel="stylesheet" type="text/css" href="${request.static_url('papyrussample:static/lib/openlayers/theme/default/style.css')}" />
    <link rel="stylesheet" type="text/css" href="${request.static_url('papyrussample:static/lib/geoext.ux/ux/Measure/resources/css/measure.css')}" />
    <link rel="stylesheet" type="text/css" href="${request.static_url('papyrussample:static/app/css/main.css')}" />
% else:
    <link rel="stylesheet" type="text/css" href="${request.static_url('papyrussample:static/build/app.css')}" />
% endif

    <script type="text/javascript">
if(!window.App) App = {};
App.OpenLayers_ImgPath = "${request.static_url('papyrussample:static/lib/openlayers/img/')}";
App.Ext_BLANK_IMAGE_URL = "${request.static_url('papyrussample:static/lib/ext/Ext/resources/images/default/s.gif')}";
App.mapservURL = "${request.registry.settings.get('mapserv.url')}";
App.printURL = "${request.registry.settings.get('print.url')}";
App.poisURL = "${request.route_path('pois_read_many')}";
    </script>

% if debug:
    <%!
    from jstools.merge import Merger
    %>\
    <%
    jsbuild_cfg = request.registry.settings.get('jsbuild_cfg')
    jsbuild_root_dir = request.registry.settings.get('jsbuild_root_dir')
    %>
    % for script in Merger.from_fn(jsbuild_cfg, root_dir=jsbuild_root_dir).run(list_only=True):
    <script type="text/javascript" src="${request.static_path(script.replace('/', ':', 1))}"></script>
    % endfor
% else:
    <script type="text/javascript" src="${request.static_url('papyrussample:static/build/app.js')}"></script>
% endif
</head>
<body>
    <div id="content">
        <h1>The Papyrus Demo</h1>

        <p class="paragraph">The goal of this Papyrus demo application is
        to demonstrate Papyrus web services, for querying and editing
        features, and printing.</p>

        <p class="paragraph">Application developers may also find it useful
        to use this application as the starting point for their
        developments. 
##        <a href="http://mapfish.org/svn/mapfish/sample/trunk/README.txt">Instructions</a> 
##        and source code can be found on the 
##        <a href="http://mapfish.org/svn/mapfish/sample/trunk/">SVN</a>.</p>
        Source code can be found on the 
        <a href="https://github.com/camptocamp/PapyrusSample">Github repository</a>.</p>

        <p class="paragraph">This demo application has the following
        features: <em>Query</em>, <em> Editing</em>, <em>Search</em>, and
        <em>Printing</em>. Click on the buttons in the toolbar above the
        map to enable/disable these features.</p>

        <p class="paragraph">To see the MapFish REST protocol in action you
        can open a debugger (Firebug for example) and look at the
        requests/responses exchanged between the browser and the Papyrus
        web services.</p>

        <div id="map"></div>

##        <p class="paragraph">In addition to this frontend page this
##        application includes an <a href="${url(controller='admin',
##            action='models')}">admin interface</a> based on <a
##            href="https://github.com/camptocamp/GeoFormAlchemy">GeoFormAlchemy</a>
##        (itself based on <a
##            href="http://docs.formalchemy.org/">FormAlchemy</a>).  This
##        demonstrates how to include GeoFormAlchemy-based admin interfaces
##        in Papyrus applications.</p>

    </div>
</body>
</html>
