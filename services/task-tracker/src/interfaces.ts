export type Task = {
  public_id: string;
  description: string;
  isClosed: boolean;
};

export class CreateTaskDto {
  description: string;
}

export class CloseTaskDto {
  id: number;
}

export type User = {
  public_id: string;
  login: string;
  role: string;
};
