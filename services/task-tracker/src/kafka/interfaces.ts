import { User } from '../interfaces';

export type EventData = {
  event_id: string;
  producer: string;
  event_name: string;
  data: User;
};
