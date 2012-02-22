<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <title>Pyramid / Papyrus workshop</title>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
    <link rel="shortcut icon" type="image/x-icon" href="${request.static_url('papyrussample:static/app/images/favicon.ico')}" />
% if debug:
    <link rel="stylesheet" type="text/css" href="${request.static_url('papyrussample:static/lib/openlayers/theme/default/style.css')}" />
    <link rel="stylesheet" type="text/css" href="${request.static_url('papyrussample:static/app/css/main.css')}" />
% else:
    <link rel="stylesheet" type="text/css" href="${request.static_url('papyrussample:static/build/app.css')}" />
% endif

    <script type="text/javascript">
        URLS = {
            OpenLayers_ImgPath: "${request.static_url('papyrussample:static/lib/openlayers/img/')}",
            pois_read_many: "${request.route_path('pois_read_many')}"
        };
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
    <div id="map"></div>
</body>
</html>
