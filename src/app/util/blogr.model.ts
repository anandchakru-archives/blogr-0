export class BlogrConstants {
  public static readonly DEFAULT_USER = 'jOsGb9PZJWS2tXYoy3VQ5cB5Um62';
  public static readonly REDIRECT_AFTER_AUTH_URL = 'REDIRECT_AFTER_AUTH_URL';
  public static readonly REDIRECT_AFTER_AUTH_QP = 'REDIRECT_AFTER_AUTH_QP';
}
export interface User {
  name: string;
  photo: string;
  email: string;
  role: string;
}

export interface BlogData {
  title: string;    // not used
  styles: Styles;   // not used
  scripts: Scripts; // not used
  posts: Posts;
}

export interface Styles {
  css: string;
  markup: string;
}

export interface Scripts {
  animation: string;
}

export interface Posts {
  page: Page;
  items: Item[];
}
export interface Page {
  pageNumber: number;
  countPerPage: number;
}
export interface Item {
  _id: string;
  title: TextWithClasses;
  subTitle: TextWithClasses;
  image: ImageWithClasses;
  body: TextWithClasses;
  footer: TextWithClasses;
}
export interface TextWithClasses {
  text: string;
  classes: string[];
}

export interface ImageWithClasses {
  src: string;
  classes: string[];
  height: string;
  width: string;
}
