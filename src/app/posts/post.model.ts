/** The post of the API. */
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

/** The fields a visitor can write. The API sets the user and the number. */
export interface PostDraft {
  title: string;
  body: string;
}
