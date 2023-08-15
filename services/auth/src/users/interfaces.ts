export type User = {
  id: number;
  public_id: string;
  login: string;
  password: string;
  role: string;
};

export class UserDto {
  login: string;
  password: string;
  role: string;
}
