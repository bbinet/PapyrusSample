from pyramid.view import view_config

from .models import (
    DBSession,
    Poi
    )

@view_config(route_name='home', renderer='index.html.mako')
def index(request):
    return {}

@view_config(route_name='pois', renderer='geojson')
def pois(request):
    pois = DBSession.query(Poi).limit(2)
    return pois.all()

@view_config(route_name='poi_count', renderer='string')
def poi_count(request):
    return DBSession.query(Poi).count()
