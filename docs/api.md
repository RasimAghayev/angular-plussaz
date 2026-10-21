# The API of Angular PlussAz

The application does not serve an API. It is a client of one: it talks to a
JSON API over https and shows what the API answers.

The demonstration points at the public mock
[JSONPlaceholder](https://jsonplaceholder.typicode.com). The address is read
from the environment of the deployment and written into the file `config.json`
that the web server places next to the application. The same image can serve
another API.

## The calls the application makes

| Call                  | Method and address   | Request           | Answer   | Used by                         |
| --------------------- | -------------------- | ----------------- | -------- | ------------------------------- |
| the list of the posts | `GET /posts/`        | none              | `Post[]` | `PostService.list()`            |
| one post              | `GET /posts/{id}`    | none              | `Post`   | `PostService.get(id)`           |
| a new post            | `POST /posts/`       | `{ title, body }` | `Post`   | `PostService.create(draft)`     |
| the change of a post  | `PUT /posts/{id}`    | `{ title, body }` | `Post`   | `PostService.update(id, draft)` |
| the removal of a post | `DELETE /posts/{id}` | none              | no body  | `PostService.delete(id)`        |
| the list of the users | `GET /users/`        | none              | `User[]` | `UserService.list()`            |

The address of every call is built from the value of the token `API_BASE_URL`,
so the whole application follows the configuration of the deployment.

## The shape of the data

A post of the API:

```json
{
  "userId": 1,
  "id": 1,
  "title": "A title of a post",
  "body": "The body of the post."
}
```

A post that the visitor writes. The user and the number are set by the API:

```json
{
  "title": "A title of a post",
  "body": "The body of the post."
}
```

A user of the API, as the application reads it:

```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "phone": "1-770-736-8031",
  "website": "hildegard.org",
  "address": { "street": "Kulas Light", "city": "Gwenborough", "zipcode": "92998-3874" },
  "company": { "name": "Romaguera-Crona", "catchPhrase": "Multi-layered client-server neural-net" }
}
```

The application reads the first four fields of a user. The rest of the answer
is not used, and a user that has no address is not a fault.

## The authentication

There is none, and the application does not pretend otherwise. The API of the
demonstration is public and answers every caller, so the application sends no
header of authorization and asks for no token.

The sign in of the interface is a guard of the pages that write, not of the
data. A caller that ignores the application can call the API directly. A
deployment against an API that has accounts would have to keep a token in the
session and send it with every call; the place of that change is the two
services of `src/app/posts/`, and nothing else.

## The validation of the request

| Field      | Rule                                            | Where the rule is checked                |
| ---------- | ----------------------------------------------- | ---------------------------------------- |
| `title`    | needed, at most 200 characters                  | the form of the page, before the call    |
| `body`     | needed, at most 500 characters                  | the form of the page, before the call    |
| `username` | needed, at most 200 characters, not only spaces | the form of the sign in, before the call |
| `id`       | a whole number, larger than zero                | the address of the page of the change    |

A form that does not pass the rules is never sent. The API of the
demonstration would accept anything, so the rules live in the application.

## The errors

The API answers with a status and a body. The application turns that answer
into one sentence and shows it above the page.

| The answer of the API           | What the visitor sees                                                         |
| ------------------------------- | ----------------------------------------------------------------------------- |
| the network is gone, status 0   | "The API could not be reached. Check the network and the address of the API." |
| a body that is a text           | the text of the body                                                          |
| a body with the field `detail`  | the value of `detail`                                                         |
| a body with the field `message` | the value of `message`                                                        |
| any other answer                | "The API answered with the status {status}."                                  |

The rule of the helper `describeApiError` is that the answer of the API is
never shown as it is: only the sentence above reaches the screen.

## The repetition of a read

| The answer of the API                  | Is the read repeated |
| -------------------------------------- | -------------------- |
| the network is gone (status 0)         | yes, twice           |
| a server error (status 500 or more)    | yes, twice           |
| the resource is not there (status 404) | no                   |
| any other status of the client         | no                   |

The pause between two attempts is 250 milliseconds. A write is never
repeated, because a second attempt would write twice.

## The tests that hold the contract

| Test                                             | What it holds                                                          |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| `src/app/posts/post.service.spec.ts`             | the method, the address and the body of every call                     |
| `src/app/posts/post.service.spec.ts`             | a read is repeated on a server error and is not repeated on a 404      |
| `src/app/posts/post.service.spec.ts`             | a write is never repeated                                              |
| `src/app/posts/post.service.spec.ts`             | the reason of a failure reaches the messages                           |
| `src/app/posts/user.service.spec.ts`             | the call of the list of the users                                      |
| `src/app/core/api-error.spec.ts`                 | the sentence of every shape of an error                                |
| `src/app/core/runtime-config.service.spec.ts`    | the reading of `config.json` and the fall back to the compiled address |
| `src/app/core/auth.guard.spec.ts`                | the guard sends a visitor that has not signed in to the sign in        |
| `src/app/core/session.service.spec.ts`           | the session, the sign out and the broken entry of the storage          |
| `src/app/auth/sign-in/sign-in.component.spec.ts` | the sign in, the unknown user and the address of the return            |
