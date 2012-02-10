#!/bin/bash

set -e

# set a value for the following variables
dbname="papyrus_sample"
dbuser="www-data"
pg_version="8.4"

# do not add the .shp extension for the shapefile name
shapefiles="poi_osm"
dirname=$(dirname $0)

usage() {
    echo "Usage: $0 [-p|--populate] [-d|--drop]"
    exit 1
}

import_shapefile() {
    shapefile=$1
    echo ${shapefile}
    if [[ -f ${dirname}/${shapefile}.shp ]]; then
        shp2pgsql -s 900913 -I -W UTF8 ${dirname}/${shapefile}.shp public.${shapefile} | psql --quiet -d ${dbname}
	psql --quiet -d ${dbname} -c "GRANT ALL ON TABLE public.${shapefile} TO \"${dbuser}\";"
	psql --quiet -d ${dbname} -c "GRANT ALL ON TABLE public.${shapefile}_gid_seq TO \"${dbuser}\";"
    fi
}

# check options
while getopts "dp" opt; do
    case $opt in
    d) drop=1 ;;
    p) populate=1 ;;
    esac
done

if [[ -n ${drop} ]] && psql -l | grep ${dbname} > /dev/null; then
    dropdb ${dbname}
fi

createdb -E unicode ${dbname}
createlang plpgsql ${dbname}

postgis_sql=""
if [ -f "/usr/share/postgresql-${pg_version}-postgis/lwpostgis.sql" ] ; then
    postgis_sql="/usr/share/postgresql-${pg_version}-postgis/lwpostgis.sql"
elif [ -f "/usr/share/postgresql/${pg_version}/contrib/postgis.sql" ] ; then
    postgis_sql="/usr/share/postgresql/${pg_version}/contrib/postgis.sql"
elif [ -f "/usr/share/postgresql/${pg_version}/contrib/postgis-1.5/postgis.sql" ] ; then
    postgis_sql="/usr/share/postgresql/${pg_version}/contrib/postgis-1.5/postgis.sql"
else
    echo "Abort: cannot find postgis sql file."
    exit 1
fi

spatial_ref_sys_sql=""
if [ -f "/usr/share/postgresql-${pg_version}-postgis/spatial_ref_sys.sql" ] ; then
    spatial_ref_sys_sql="/usr/share/postgresql-${pg_version}-postgis/spatial_ref_sys.sql"
elif [ -f "/usr/share/postgresql/${pg_version}/contrib/spatial_ref_sys.sql" ] ; then
    spatial_ref_sys_sql="/usr/share/postgresql/${pg_version}/contrib/spatial_ref_sys.sql"
elif [ -f "/usr/share/postgresql/${pg_version}/contrib/postgis-1.5/spatial_ref_sys.sql" ] ; then
    spatial_ref_sys_sql="/usr/share/postgresql/${pg_version}/contrib/postgis-1.5/spatial_ref_sys.sql"
else
    echo "Abort: cannot find spatial_ref_sys sql file."
    exit 1
fi
psql --quiet -d ${dbname} < $postgis_sql
psql --quiet -d ${dbname} < $spatial_ref_sys_sql

psql --quiet -c "GRANT ALL ON DATABASE \"${dbname}\" TO \"${dbuser}\";"
psql --quiet -d ${dbname} -c "GRANT ALL ON TABLE geometry_columns TO \"${dbuser}\";"
psql --quiet -d ${dbname} -c "GRANT ALL ON TABLE spatial_ref_sys TO \"${dbuser}\";"

if [[ -n ${populate} ]]; then
    for shapefile in ${shapefiles}; do
	import_shapefile "${shapefile}"
    done
fi

exit 0
