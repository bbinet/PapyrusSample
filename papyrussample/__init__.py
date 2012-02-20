from pyramid.config import Configurator
from pyramid.mako_templating import renderer_factory as mako_renderer_factory
from papyrus.renderers import GeoJSON
import papyrus
from sqlalchemy import engine_from_config

from .models import DBSession

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    config = Configurator(settings=settings)

    # include Papyrus config
    config.include(papyrus.includeme)

    # bind the mako renderer to other file extensions
    config.add_renderer('.mako', mako_renderer_factory)
    config.add_renderer('geojson', GeoJSON())

    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    config.add_papyrus_routes('pois', '/pois')
    config.scan()
    return config.make_wsgi_app()

