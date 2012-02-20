from pyramid.view import view_config

@view_config(route_name='home', renderer='index.html.mako')
def index(request):
    return {}
