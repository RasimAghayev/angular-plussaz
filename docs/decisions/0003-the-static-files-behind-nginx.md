# 3. The static files behind nginx in the container

Date: 2026-10-21

## Status

Accepted.

## The context

The application is a single page application. It needs a server that
delivers the files of the build, answers every address that is not a file
with the page of the application, and holds a place for the file of the
configuration of the deployment.

The project had no container at all: the application was run with `ng serve`
on the machine of the developer, and the build was put behind whatever the
host of the deployment used.

## The decision

The application is delivered as a container that holds nginx and the static
files of the build.

- `build/app/Dockerfile` holds the stages: the tree of the dependencies, the
  build, the image of the tests and the image of the runtime.
- The image of the runtime copies the result of the build into the web
  server, runs as the unprivileged user `nginx` and holds no secret.
- The entry point of the container writes the configuration of the deployment
  and then hands the work over to the web server.
- `docker-compose.yml` holds the application and the service of the tests.
  The service of the tests is behind the profile `test`, so the stack of the
  development holds nothing but the application.

The state of the stack lives under `var/`, and no service of the stack points
at an image of a registry.

## The reasons

- The environment of the development, of the tests and of the release is the
  same image, so a defect of the environment cannot appear only on a machine
  of the developer.
- The image of the runtime is small: it holds the files of the build and the
  web server, and nothing of the toolchain of the build.
- The process runs as an unprivileged user, and the files of the temporary
  work of the server live under `/tmp`, which every user owns.
- The address of the API is written into the configuration of the server when
  the container starts, so one image serves every environment.

## The trade-offs

- A second configuration has to be kept: the file of the template of the
  server and the file of the configuration itself. The entry point writes the
  second one from the first one, so the drift is caught when the container
  starts.
- The web server is a program of its own, and it has to be watched like any
  other part of the deployment. Its health is asked for with `/healthz`.

## What was rejected

- **The dev server of the command line in the container.** It watches the
  files, it compiles on every change, and it is not the thing that is
  released.
- **A separate image for the web server.** The application and the server
  change at the same time, and one image of both keeps the pair in step.
