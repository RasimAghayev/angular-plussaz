/** The user of the session. It holds no secret: the data of the API is public. */
export interface SessionUser {
  id: number;
  name: string;
  username: string;
  email: string;
}
