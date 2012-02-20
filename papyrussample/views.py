from pyramid.view import view_config

from .models import (
    DBSession,
    MyModel,
    )

@view_config(route_name='home', renderer='index.html.mako')
def index(request):
    one = DBSession.query(MyModel).filter(MyModel.name=='one').first()
    return {'one':one, 'project':'PapyrusSample'}
