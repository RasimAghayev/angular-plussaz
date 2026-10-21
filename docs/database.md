# The data of Angular PlussAz

The application holds no database. There is no schema, no migration and no
database in the stack.

## Where the data lives

| Data                       | Where it lives                                                                                  | How long                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| the posts                  | the API                                                                                         | as long as the API holds them                                      |
| the users                  | the API                                                                                         | as long as the API holds them                                      |
| the session of the visitor | the storage of the browser, under the key `angular-plussaz.session.v1`                          | until the sign out, or until the storage of the browser is cleared |
| the address of the API     | the file `config.json` next to the application, and the value that was compiled into the bundle | for the life of the container                                      |

The list of the posts lives in the memory of the browser while the page is
open. It is not written to the storage: the browser asks the API again when
the page is opened anew.

## Why there is no database

The business of the application is to show and to change the posts of an API
that somebody else owns. A database of its own would hold a second copy of
that data, and the two copies would drift apart as soon as somebody writes to
the API from another place. The rule of the project is that the API is the
only truth about a post.

The one exception is the session, and it is not a copy of anything: it holds
the name of a user of the API, which the application needs to show who is
signed in.

## The state of the interface that is not in the API

The state of the interface lives in the signals of the application and never
reaches the storage of the browser:

| State                          | Where it lives                                                     |
| ------------------------------ | ------------------------------------------------------------------ |
| the posts of the page          | the signal `posts` of the list                                     |
| the page that is on the screen | the signal `page` of the list                                      |
| the state of the loading       | the signal `loading` of the list                                   |
| the state of the sending       | the signal `submitting` of the forms                               |
| the message of the last action | the signals of the `NotificationService`                           |
| the user of the session        | the signal of the `SessionService`, and the storage of the browser |

The reason is that this state belongs to the open tab. A reload of the page
asks the API again, and that is the answer a visitor expects.

## The entry of the session in the storage

The entry of the session is a JSON object with four fields:

```json
{ "id": 1, "name": "Leanne Graham", "username": "Bret", "email": "Sincere@april.biz" }
```

The application reads it back with care: an entry that is not JSON, an entry
without a number for `id` and an entry without a name for `username` are all
read as no session at all. A storage that cannot be written, which happens
when the browser forbids it, leaves the session alive for the tab that is
open.

The entry holds no secret. The API needs no password, so there is nothing to
hide; see [security.md](security.md).

## If the application grew a database

The change would be small and local. The two services of `src/app/posts/`
are the only place that talks to the outside, so a repository of posts would
sit behind them, the way the API sits behind them now. The session would move
from the storage of the browser to a token of the API, and the guard would
check that token instead of the name of the user.
