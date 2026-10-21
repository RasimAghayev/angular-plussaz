# The work on Angular PlussAz

The work happens on the application itself, in a container. The host needs
Docker and a checkout of the repository, nothing else.

## The first time

```shell
git clone https://github.com/RasimAghayev/angular-plussaz.git
cd angular-plussaz
mkdir -p var
cp .env.example var/.env
docker compose --env-file var/.env build
```

The first build takes a while: it downloads the base images and the tree of
the dependencies. The lock file decides the tree, so every machine gets the
same one.

## The loop of the work

The application is served by the container, and the files of the build are
read out of the container, so a change is seen after a rebuild:

```shell
docker compose --env-file var/.env build app
docker compose --env-file var/.env up -d app
```

The application is then at `http://localhost:8080`.

The tests and the formatting run in the image of the tests:

```shell
docker compose --env-file var/.env --profile test run --rm test
```

The image of the tests carries the sources of the moment it was built. After
a change of the code, the image has to be built again:

```shell
docker compose --env-file var/.env build test
docker compose --env-file var/.env --profile test run --rm test
```

## The work on the source without a container

Writing the code needs no tool of the command line: the editor of the host is
enough. Everything that runs the code of the project runs in a container:
the build, the tests, the audit, the application.

The files of the project are written with the rules of `.editorconfig`:
utf-8, two spaces, a line at the end of the file, no space at the end of a
line. The shape of the lines of the code is held by Prettier, and the
`.prettierignore` names the files that are not written by hand.

The line endings are held by `.gitattributes`: the files are stored with LF
and are checked out with LF on every machine, so the image of a Windows
checkout holds the same files as the image of a Linux one. Without that, the
linter would report every file of the project on a Windows machine.

## The branches

| Branch   | Meaning                                           |
| -------- | ------------------------------------------------- |
| `master` | the released state of the application             |
| `test`   | the state that is checked against the whole stack |

Every change is made in a branch of its own, opened as a pull request into
`test`, and merged into `master` after the gate of the release passed. The
branches `master` and `test` are never deleted.

The reasons for the decisions of the project are in [decisions/](decisions/),
and the state of the work is in the pull requests of the repository.

## When something does not start

| Symptom                           | What to look at                                                                                 |
| --------------------------------- | ----------------------------------------------------------------------------------------------- |
| the container does not start      | `docker compose --env-file var/.env logs app`                                                   |
| the application answers 404       | the file `config.json` is missing: the image of the runtime writes it when the container starts |
| the tests do not find the changes | the image of the tests is older than the code: build it again                                   |
| the linter reports every file     | the line endings of the checkout: `git checkout -- .` after the file `.gitattributes` was added |
| the port 8080 is taken            | `APP_PORT` in `var/.env`                                                                        |

## The state of the stack

The state of the stack lives under `var/`. It holds the file of the
environment and nothing else, and it is not in the repository. The command
`docker compose --env-file var/.env down -v` stops the stack and frees the
state.
