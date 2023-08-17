import { User, Task } from '../interfaces';

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

export interface AccountingEvent extends Event {
  event_date: Date;
  data: {
    task: string;
    user: string;
    price: number;
  };
}
