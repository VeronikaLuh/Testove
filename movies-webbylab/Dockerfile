FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

COPY env-config.js.template /usr/share/nginx/html/env-config.js.template

RUN apk add --no-cache gettext

CMD ["sh", "-c", "envsubst '${API_URL}' < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js && envsubst '${API_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

EXPOSE 3000