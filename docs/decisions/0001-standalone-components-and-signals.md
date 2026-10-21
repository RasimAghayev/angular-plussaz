# 1. Standalone components, signals and no zones

Date: 2026-10-21

## Status

Accepted.

## The context

The application was written in March 2023 on a release candidate of Angular 16. It used a module for the application, another for every page, subjects for
the state and the zones of the change detection. The state of the interface
was spread over the subjects of the services and the pages, and a page that
was left open held a subscription that nothing closed.

Angular 22 is the current line of the framework. Its model is the standalone
component, the signal and the change detection without zones.

## The decision

The application runs on standalone components. Every page is a component that
imports what it uses, and the state of the interface lives in signals.

- The modules of the application were removed; there is one `AppModule` less.
- The state that the interface shows is a signal, the derived state is a
  `computed`, and the side effects that have to happen once are an `effect`.
- The HTTP client uses the backend of `fetch`, and the application runs
  without zones.
- The pages that were built with `Subject` and `subscribe` now read a signal
  and write it.

## The reasons

- The model of the framework is the one the code is written in now. A change
  in a year would have to move the state anyway, and the move is the larger
  part of the work.
- The state of a page is a value, not a stream. A page that reads a signal
  does not need a subscription, and it cannot leak one.
- The change detection without zones removes the need to mark a page as
  changed by hand, and it removes the errors that came from a change that was
  forgotten.

## The trade-offs

- The signals are the model of Angular, and a developer who knows the older
  model has to learn them.
- The effect that removes the message after five seconds is the one place
  where the timing of the interface lives, and it needs a cleanup so a new
  message does not cut the life of the old one short.

## What was rejected

- **Keeping the modules.** The modules of the application hold nothing but
  declarations, and the pages of Angular 22 do not need them.
- **Keeping the zones.** The application is small and writes to a few
  signals; the zones would add a second model of the change detection beside
  the first.
