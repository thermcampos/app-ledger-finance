# Build stage
FROM node:26-alpine AS build

WORKDIR /app

# Accept build arguments
ARG VITE_BACKEND_SERVER
ARG VITE_BUILD_NUMBER

# Set as environment variables for the build
ENV VITE_BACKEND_SERVER=$VITE_BACKEND_SERVER
ENV VITE_BUILD_NUMBER=$VITE_BUILD_NUMBER

# Copy package files
COPY *.html *.json *.ts *.js ./
COPY ./src ./src
COPY ./public ./public

# Install dependencies
RUN npm i --ignore-scripts --no-update-notifier --omit=dev && \
  npm run build && \
  rm -rf node_modules

# Production stage
FROM nginx:alpine

# nginx config as a template: the image's entrypoint renders /etc/nginx/templates/*.template into
# /etc/nginx/conf.d/ at start, substituting only RELEASE_VERSION (the deployed release tag, set by
# Terraform; served at /version.json). Empty by default so the container starts anywhere.
ENV RELEASE_VERSION=""
ENV NGINX_ENVSUBST_FILTER="^RELEASE_VERSION$"
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
