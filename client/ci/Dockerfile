FROM nginx:alpine

ENV API_HOST=http://localhost:3001

ADD ./build /usr/share/nginx/html
ADD ./ci/nginx-templates /etc/nginx/templates
