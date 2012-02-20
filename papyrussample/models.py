from sqlalchemy import (
    Column,
    Integer,
    Unicode,
    )
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import (
    scoped_session,
    sessionmaker,
    )
from geoalchemy import (
    GeometryColumn,
    Point,
    )
from zope.sqlalchemy import ZopeTransactionExtension
from papyrus.geo_interface import GeoInterface

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()

class Poi(GeoInterface, Base):
    __tablename__ = 'poi_osm'
    gid = Column(Integer, primary_key=True)
    rating  = Column(Integer)
    name = Column(Unicode(250))
    code_dept = Column(Unicode(100))
    type_desc = Column(Unicode(254))
    type = Column(Unicode(20))
    theme = Column(Unicode(250))
    the_geom = GeometryColumn(Point(srid=900913))

