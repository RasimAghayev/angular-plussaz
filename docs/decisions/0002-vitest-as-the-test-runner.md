# 2. Vitest as the runner of the tests

Date: 2026-10-21

## Status

Accepted.

## The context

The tests of the project ran on Karma with Jasmine. Karma needs a browser:
the runner starts one, opens a page in it, and reports from there. That
browser is the reason the test of the project was slow, and it is a tool
that has to be installed on the machine that runs the tests.

The builder of the unit tests of Angular 22 runs the suite on vitest, which
runs on Node, with a DOM of jsdom when a test needs one.

## The decision

The tests run on vitest through the builder `@angular/build:unit-test`. The
globals of vitest are the ones the test files use, and `tsconfig.spec.json`
holds their types.

The packages `vitest` and `jsdom` are named in the file of the package, and
the lock file holds their versions.

## The reasons

- The suite needs no browser. The image of the tests needs the toolchain of
  Node and nothing else, so the image is smaller and the gate is faster.
- The builder of the framework is the supported path. A test file is a test
  file, with no configuration of Karma and no file of the launcher.
- The interface of vitest is the one of the runner of the framework. The
  familiar commands of `describe`, `it` and `expect` stay as they were.

## The trade-offs

- A test that needs a real browser, with a real layout, cannot be written
  here. The tests of the components work on the test bed of Angular, which
  builds the component and its template, and that is enough for the
  behaviour of the application.
- The project carries two packages that Karma does not need any more. They
  are small, and they are named in the file of the package so the versions
  are held by the lock file.

## What was rejected

- **Karma with a headless browser.** It keeps a browser in the image of the
  tests, and it keeps a second runner beside the one of the framework.
- **A runner of its own, outside the builder.** The builder of the framework
  holds the compilation of the templates, and a runner beside it would have
  to hold it too.
