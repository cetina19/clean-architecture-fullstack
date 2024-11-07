FROM postgres:latest

ENV POSTGRES_USER=username
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=mydatabase

COPY ./db_scripts/init.sql /docker-entrypoint-initdb.d/init.sql

VOLUME ["/var/lib/postgresql/data"]

EXPOSE 5432
