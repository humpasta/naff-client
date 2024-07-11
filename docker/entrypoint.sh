#!/bin/sh

# Replace the placeholder in config.json with the actual environment variable
sed -i "s|API_URL|$API_URL|g" /usr/share/nginx/html/assets/config.json

# Replace the placeholder in nginx-http-custom.conf with the actual environment variable
sed -i "s|SERVER_NAME|$SERVER_NAME|g" /etc/nginx/conf.d/default.conf

# Start Nginx
nginx -g 'daemon off;'
