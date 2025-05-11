FROM mysql:8.0

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=elvitrina

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/

# Expose MySQL port
EXPOSE 3306 