# The deployment of Angular PlussAz

The application is delivered as a container that holds a web server and the
static files of the build. There is nothing to install on the host.

## The images

Both images are built from `build/app/Dockerfile` and both are built locally.
No service of the stack points at an image of a registry.

| Stage     | Holds                                                     | Used for                         |
| --------- | --------------------------------------------------------- | -------------------------------- |
| `deps`    | the toolchain of Node 24 and the tree of the dependencies | the base of the two other stages |
| `build`   | the result of `ng build`                                  | the files of the application     |
| `test`    | the sources, the toolchain and the commands of the tests  | the gate of the project          |
| `runtime` | the web server and the files of the build                 | the application that is served   |

The base images are pinned by digest, so a build of the project cannot pick up
another toolchain than the one the lock file was resolved for.

The image of the runtime runs as the unprivileged user `nginx`, and it holds
no secret.

## The configuration of a deployment

| Variable       | Meaning                                              | Default                                |
| -------------- | ---------------------------------------------------- | -------------------------------------- |
| `API_BASE_URL` | the address of the JSON API the application talks to | `https://jsonplaceholder.typicode.com` |
| `APP_PORT`     | the host port the application is reachable at        | `8080`                                 |

The address of the API reaches the application in two ways, and both are
written when the container starts:

1. The web server writes the file `config.json` next to the application. The
   application reads it before the first page is drawn.
2. The web server writes the address into the rule of the security of the
   content, so the browser may talk to that address and to no other.

Nothing else of the deployment can be changed without a new build. The
decisions that are compiled into the bundle are in
`src/environments/environment.ts`.

## The run of the stack

```shell
mkdir -p var
cp .env.example var/.env
docker compose --env-file var/.env build
docker compose --env-file var/.env up -d
```

The application is then reachable at `http://localhost:8080`. The commands of
the stack always need `--env-file var/.env`, because the variables live in
that file and not in the root of the project.

To stop the stack and to free the state:

```shell
docker compose --env-file var/.env down -v
```

## The health of the container

The image carries a health check that asks for `/healthz`:

```
HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=10s
```

The answer of `/healthz` is a plain `ok`. The check does not touch the API, so
a container is healthy when its web server answers, and not when the API
behind it is in reach.

## The web server

The configuration of the server is in `build/nginx/`:

| File                    | What it holds                                                                                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nginx.conf`            | the server itself: the logs to the standard streams, the temporary files under `/tmp` so the unprivileged user can write them, the compression, the answer of the cache |
| `default.conf.template` | the server of the application: the address of the API, the rules of the cache, the headers of the security, the answer of the health check                              |
| `entrypoint.sh`         | the writing of the configuration of the deployment and the start of the server                                                                                          |

The rules of the cache follow the shape of the build: the files with a name
that carries a hash are kept by the browser for good, the page of the
application and the file of the configuration are never kept, and every other
answer is checked with the browser.

The headers of the security are set in the server block, and in no other
place: a header that is set inside a location replaces the headers of the
server block, so the page of the application would lose the protection of the
browser.

## Behind a reverse proxy

The container serves plain http on the port 8080 and expects the proxy in
front of it to do the termination of the tls. The proxy has to pass the
original address of the browser, because the application asks for
`config.json` relative to the base of the page, and it must not cache the
page of the application.

The `Content-Security-Policy` of the server names the address of the API in
`connect-src`. A proxy that serves the application under another address
needs no change: the rules of the content are written by the container itself
and the address of the API is the only one that matters.

## The state of the stack

The state of the stack lives under `var/`. There are no named volumes. The
image of the application carries the files of the build, so nothing of the
repository is mounted into a running container.
