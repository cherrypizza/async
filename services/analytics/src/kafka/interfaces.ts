import { User, Task, AccountLog, Account } from '../interfaces';

type Event = {
  event_id: string;
  producer: string;
  event_name: string;
};

export interface UserEvent extends Event {
  data: User;
}

export interface TaskEvent extends Event {
  data: Task;
}

export interface AccountLogEvent extends Event {
  data: AccountLog;
}

export interface AccountEvent extends Event {
  data: Account;
}
