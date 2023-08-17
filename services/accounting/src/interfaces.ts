export type Task = {
  public_id: string;
  description: string;
  executor: string;
  price1: number;
  price2: number;
};

export type User = {
  public_id: string;
  login: string;
  role: string;
};

export type AccountLog = {
  public_id: string;
  user: string;
  task: string;
  created: Date;
  price: number;
};
