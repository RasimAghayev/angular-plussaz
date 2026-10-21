# Angular PlussAz

A front end for a blog API. It lists the posts of the API, opens one of them,
creates a post, changes a post and removes a post. The demonstration talks to
the public mock [JSONPlaceholder](https://jsonplaceholder.typicode.com), and
the same image can be pointed at another API.

Angular 22 on Node 24, and a Docker Compose stack for the development, the
tests and the production build.

## What it does

- **The list of the posts** is paged ten at a time, and every post can be
  opened, changed or removed.
- **A new post** asks for a title and a body, and the API sets the author and
  the number of the post.
- **The sign in** asks for the name of a user of the API. The API of the
  demonstration is public and holds no accounts, so the name is enough to open
  the pages that write. It is a convenience of the interface, not a security
  boundary — see [docs/security.md](docs/security.md).
- **The messages** of the application — the answer of a successful action and
  the reason of a failure — are shown above the page and disappear after five
  seconds.
- **The address of the API** is read at the start of the application from the
  file `config.json`, so one image serves every environment. When the file is
  not there, the address that was compiled into the build is used.

The rules of the business are in [docs/business-logic.md](docs/business-logic.md),
the contract of the API is in [docs/api.md](docs/api.md), and the shape of the
code is in [docs/architecture.md](docs/architecture.md).

## Running it

```shell
mkdir -p var
cp .env.example var/.env
docker compose --env-file var/.env build
docker compose --env-file var/.env up -d
```

The application is reachable at `http://localhost:8080`. `APP_PORT` in
`var/.env` moves it to another host port, and `API_BASE_URL` moves it to
another API.

Every command of the stack needs `--env-file var/.env`, because the variables
of the stack live in that file and not in the root of the project.

The state of the stack lives under `var/`. Named volumes are not used.

## The tests

```shell
docker compose --env-file var/.env --profile test run --rm test
```

The image of the tests runs the check of the formatting and the unit tests.
It needs neither a database nor a service of the stack.

The build of the application is checked with the same stack:

```shell
docker compose --env-file var/.env build app
```

The whole gate — the check of the compose file, the build of the images, the
tests, the audit of the dependencies and the build of the application — runs
in the pipeline of the repository. The steps of the pipeline are in
[docs/testing.md](docs/testing.md).

## The branches

| Branch   | Meaning                                           |
| -------- | ------------------------------------------------- |
| `master` | the released state of the application             |
| `test`   | the state that is checked against the whole stack |

Every change is made in a branch of its own, opened as a pull request into
`test`, and merged into `master` after the gate of the release passed.

## The documentation

| Document                                               | Content                                                   |
| ------------------------------------------------------ | --------------------------------------------------------- |
| [docs/architecture.md](docs/architecture.md)           | the modules, their dependencies and the flow of a request |
| [docs/business-logic.md](docs/business-logic.md)       | the users, the use cases, the rules and the states        |
| [docs/api.md](docs/api.md)                             | the endpoints of the API and the contract of every call   |
| [docs/database.md](docs/database.md)                   | why the application holds no database                     |
| [docs/testing.md](docs/testing.md)                     | the tests, the gate and the pipeline                      |
| [docs/deployment.md](docs/deployment.md)               | the images, the configuration and the deployment          |
| [docs/security.md](docs/security.md)                   | the controls, the limits and the known risks              |
| [docs/development-setup.md](docs/development-setup.md) | the work on the application itself                        |

## The state of the repository

The application was written in March 2023 as an exercise of the Angular
command line, on the release candidates of Angular 16. It was modernized to
Angular 22 in October 2026: the modules became standalone components, the
signals replaced the subjects, the runner of the tests became vitest, the
package `crypto-js` was removed, and the repository gained a container, a
pipeline and this documentation. The record of the change is in
[docs/decisions/](docs/decisions/).
