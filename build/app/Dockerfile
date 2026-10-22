# The images of the application.
#
# The base images are pinned by digest: a floating tag would let the toolchain
# drift away from the version the lock file was resolved for. The source of the
# application is copied into the image, so the container needs no mount of the
# repository.

FROM node:24.22.0-alpine@sha256:44fce696f38ba8c987c4db89954051000bbd05ffd8d8659ba15ed4a8602e937f AS base

WORKDIR /app

# The dependency layer. The lock file alone decides the tree, so the layer is
# reused whenever only the application code changes.
FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# The build of the application. Its result is the directory of the static files
# that the web server delivers.
FROM deps AS build

COPY . .
RUN npm run build

# The image of the tests. It carries the sources and the toolchain, and it
# needs neither a database nor the network.
FROM deps AS test

COPY . .
CMD ["sh", "-c", "npm run format:check && npm run test:ci"]

# The image that runs the application: the static files behind the web server.
# The process runs as the unprivileged user nginx, and the image holds no
# secret.
FROM nginx:1.31-alpine@sha256:a3554c0d0b48177b1413c26e01f695334428020d9df01243fbae3e11cfd17417 AS runtime

COPY build/nginx/nginx.conf /etc/nginx/nginx.conf
COPY build/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY build/nginx/entrypoint.sh /entrypoint.sh

COPY --from=build /app/dist/angular-plussaz/browser /usr/share/nginx/html

RUN chmod +x /entrypoint.sh \
    && chown -R nginx:nginx /usr/share/nginx/html

USER nginx

EXPOSE 8080

# The application answers the health check without a body. The check asks for
# it, so a running process and a dead one can be told apart.
HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=10s \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1

ENTRYPOINT ["/entrypoint.sh"]
