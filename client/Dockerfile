FROM node:22-alpine3.19 AS build

WORKDIR /app
COPY . .
ARG SERVER_DOMAIN
ARG SERVER_PORT
ARG CLIENT_PORT
ARG IS_HTTPS
ARG ROOM_PER_SESSION
ARG USER_PER_ROOM
RUN npm i
RUN npm run build -- --env SERVER_DOMAIN=${SERVER_DOMAIN} --env SERVER_PORT=${SERVER_PORT} --env IS_HTTPS=${IS_HTTPS} --env CLIENT_PORT=${CLIENT_PORT} --env ROOM_PER_SESSION=${ROOM_PER_SESSION} --env USER_PER_ROOM=${USER_PER_ROOM} 

FROM nginx:alpine AS prod

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80/tcp
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
