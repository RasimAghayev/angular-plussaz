# The security of Angular PlussAz

The threat of the demonstration is small: a static front end that talks to a
public mock API. The controls below are the ones that belong to such a
project. Where the project is not a security boundary, that is said plainly
instead of being dressed up.

## The controls that are in place

| Control                                                           | Where                                       | What it holds                                                                                                                    |
| ----------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| the content of the answer is not interpreted as code              | the templates of the components             | the text of a post and the message of a failure are bound as text, never as html                                                 |
| the rule of the content                                           | `build/nginx/default.conf.template`         | the browser may load scripts and styles only from the application itself, and may talk to the address of the API and to no other |
| the protection of the browser against the content of another kind | the same file                               | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`                                                                   |
| the answer of the page is never kept                              | the same file                               | the page of the application and the file of the configuration carry `no-store`                                                   |
| the container runs as an unprivileged user                        | `build/app/Dockerfile`                      | the process of the web server is the user `nginx`                                                                                |
| no secret in the image                                            | the same file                               | the image holds the address of a public API, which is not a secret                                                               |
| no secret in the repository                                       | `.env.example`, `.dockerignore`             | the file of the environment holds no value, and the real one is not in the build context                                         |
| the repetition of a read only                                     | `src/app/core/api-retry.ts`                 | a write is never sent twice                                                                                                      |
| the reason of a failure is a sentence                             | `src/app/core/api-error.ts`                 | the raw answer of the API does not reach the screen                                                                              |
| the address of the return is checked                              | `src/app/auth/sign-in/sign-in.component.ts` | only a path of this application is accepted, so the address cannot send the visitor to another host                              |
| the address of the API is checked before the call                 | `src/app/posts/post.service.ts`             | the id of a post is a whole number larger than zero                                                                              |
| the dependencies are audited                                      | the pipeline                                | `npm audit` runs on every pull request and fails on a high finding                                                               |

## What is not a security boundary

**The sign in.** The API of the demonstration has no accounts and answers
every caller. The session holds the name of a user in the storage of the
browser, in plain text, and it holds nothing secret. The guard of the pages
that write keeps the demonstration tidy; it does not keep anything from
somebody who calls the API directly. A deployment against an API with
accounts has to keep a token in the session and has to check that token in
the API.

**The address of the API.** The value of `API_BASE_URL` is written into the
rule of the content of the container, so anybody who can read the
configuration of the container can read it. It is the address of a public
mock, and it is not a secret. A deployment against an API that needs a
credential has to deliver that credential in a way that does not reach the
browser; the file `config.json` is public, so it is not the place for it.

**The CORS of the API.** The application is a client in the browser, so the
API has to allow the origin of the application. The rule of the content of
the container allows the address of the API and no other, but the answer that
matters is the one of the API.

## The risks that are known

| Risk                                                  | Why it is not fixed                                                                          | What would fix it                                      |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| a user of the browser can change the state of the API | the API of the demonstration has no accounts                                                 | a real API with tokens, and a session that holds one   |
| the session of the browser can be read and changed    | the session holds no secret, so there is nothing to steal                                    | the same: a token instead of a name                    |
| the list of the posts grows with the API              | the mock holds a hundred posts; a real API would answer with a page                          | paging in the API and a paged answer in the service    |
| the dependencies of the build can carry a finding     | the audit runs on every pull request, but a finding that is not high does not stop the merge | a policy of the repository that fails on every finding |

## The checks of the change

Before a change is merged, the gate of the project runs:

1. the audit of the dependencies (`npm audit --audit-level=high`),
2. the check of the formatting and the unit tests,
3. the build of the image of the application.

The rule of the content and the headers of the security are in the
configuration of the web server, so a change of them shows up in the diff of
the image and in the answer of the running container.
