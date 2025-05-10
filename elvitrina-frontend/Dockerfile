# Stage 1: Build Angular app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build -- --output-path=./dist/Modernize --output-hashing=all

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy Angular build output
COPY --from=build /app/dist/Modernize /usr/share/nginx/html

# Copy the NGINX config template
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx2.conf /etc/nginx/nginx.conf

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]