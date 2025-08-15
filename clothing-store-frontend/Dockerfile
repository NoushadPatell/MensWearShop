# Build Stage
FROM node:20-alpine as build
WORKDIR /app

# Accept build-time argument
ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE

# Copy code and install
COPY . .
RUN npm install && npm run build

# Serve Stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

