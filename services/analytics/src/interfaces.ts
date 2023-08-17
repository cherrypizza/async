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

export type Account = {
  public_id: string;
  user: string;
  date: Date;
  balance_start: number;
  balance_end: number;
  pay: number;
};
