from pyramid.view import view_config
from papyrus.protocol import Protocol

from .models import (
    DBSession,
    Poi
    )


proto = Protocol(DBSession, Poi, 'the_geom')

@view_config(route_name='pois_read_many', renderer='geojson')
def read_many(request):
    return proto.read(request)

@view_config(route_name='pois_read_one', renderer='geojson')
def read_one(request):
    id = request.matchdict.get('id', None)
    return proto.read(request, id=id)

@view_config(route_name='pois_count', renderer='string')
def count(request):
    return proto.count(request)

@view_config(route_name='pois_create', renderer='geojson')
def create(request):
    return proto.create(request)

@view_config(route_name='pois_update', renderer='geojson')
def update(request):
    id = request.matchdict['id']
    return proto.update(request, id)

@view_config(route_name='pois_delete')
def delete(request):
    id = request.matchdict['id']
    return proto.delete(request, id)


@view_config(route_name='home', renderer='index.html.mako')
def index(request):
    return {'debug': 'debug' in request.params}
