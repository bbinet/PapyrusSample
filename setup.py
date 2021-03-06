import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.txt')).read()
CHANGES = open(os.path.join(here, 'CHANGES.txt')).read()

requires = [
    'pyramid>=1.3a8',
    'papyrus',
    'SQLAlchemy',
    'GeoAlchemy',
    'psycopg2',
    'transaction',
    'pyramid_tm',
    'pyramid_debugtoolbar',
    'zope.sqlalchemy',
    'waitress',
    'JSTools',
    ]

setup(name='PapyrusSample',
      version='0.0',
      description='PapyrusSample',
      long_description=README + '\n\n' +  CHANGES,
      classifiers=[
        "Programming Language :: Python",
        "Framework :: Pylons",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
        ],
      author='',
      author_email='',
      url='',
      keywords='web wsgi bfg pylons pyramid',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      test_suite='papyrussample',
      install_requires = requires,
      entry_points = """\
      [paste.app_factory]
      main = papyrussample:main
      [console_scripts]
      populate_PapyrusSample = papyrussample.scripts.populate:main
      """,
      )

