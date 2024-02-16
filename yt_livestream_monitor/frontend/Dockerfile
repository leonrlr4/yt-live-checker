FROM node:18.19.0
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/
RUN npm run build
FROM nginx:stable-alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
