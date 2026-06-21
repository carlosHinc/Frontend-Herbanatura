export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthToken {
  token: string;
  user: User;
}
