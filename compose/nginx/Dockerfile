FROM nginx:1.14.1
RUN rm /etc/nginx/nginx.conf
COPY conf.d/nginx.conf /etc/nginx/
RUN rm /etc/nginx/conf.d/default.conf
COPY conf.d/sails.conf /etc/nginx/conf.d/