FROM node:20 as builder

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx ng build --configuration production

FROM nginx:stable as runner

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx-http-custom.conf /etc/nginx/conf.d/default.conf

# Copy the entrypoint script
COPY docker/entrypoint.sh /entrypoint.sh

# Copy and install our application
COPY --from=builder /usr/src/app/dist/naff-client/browser/ /usr/share/nginx/html

# add permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
       chmod -R 755 /usr/share/nginx/html && \
       chown -R nginx:nginx /var/cache/nginx && \
       chown -R nginx:nginx /var/log/nginx && \
       chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
       chown -R nginx:nginx /var/run/nginx.pid

WORKDIR /usr/share/nginx/html

# Ensure the entrypoint script is executable
RUN chmod +x /entrypoint.sh

# switch to non-root user
USER nginx

# Set the entrypoint to the script
ENTRYPOINT ["/entrypoint.sh"]
