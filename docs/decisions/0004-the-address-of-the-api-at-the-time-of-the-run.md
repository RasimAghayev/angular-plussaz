# 4. The address of the API at the time of the run

Date: 2026-10-21

## Status

Accepted.

## The context

The address of the API was written in the source, in the file of the
environment of the build. A change of the address meant a change of the
source, a new build, and a new image for every environment.

The address of the API is the one thing about a deployment that changes from
one place to another: the demonstration, the test of the demonstration and the
production talk to different APIs.

## The decision

The address of the API is read at the time the application starts.

- The container writes the file `config.json` next to the application, with
  the value of the environment `API_BASE_URL`.
- The application reads that file before the first page is drawn, in an
  initializer of the application, so no request leaves the browser with the
  wrong address.
- When the file is missing or broken, the address that was compiled into the
  bundle is used. The application starts in every environment.
- The web server writes the same address into the rule of the content, so the
  browser may talk to that address and to no other.

The value that was compiled into the bundle is in `src/environments/environment.ts`
and stays the address of the public mock of the demonstration.

## The reasons

- One image serves every environment. The change of the address is a change
  of the environment of the container, and nothing else.
- The file of the configuration is read before the first request, so the
  interface never shows a moment with a wrong address.
- The fall back keeps the application usable when the file cannot be
  delivered, which happens when the application is served by a host that
  knows nothing about it.

## The trade-offs

- The file of the configuration is public, so it cannot hold a secret. A
  deployment that needs a credential has to deliver it in another way.
- The address of the API exists in two places in the container: in the file
  of the configuration and in the rule of the content. Both are written from
  the same variable when the container starts, so they cannot drift apart.
- The read of the file happens once, at the start. A change of the address
  of a running container needs a new start of the container.

## What was rejected

- **The address in the build only.** A change of the address would need a
  new image for every environment.
- **The address in the storage of the browser.** The visitor would have to
  type it, and the rule of the content could not name it.
