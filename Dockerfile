FROM node:20 as builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx ng build --configuration production

FROM nginx:stable as runner

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx-http-custom.conf /etc/nginx/conf.d/default.conf

# Copy and install our application
COPY --from=builder /usr/src/app/dist/naff-client/ /usr/share/nginx/html

WORKDIR /usr/share/nginx/html
