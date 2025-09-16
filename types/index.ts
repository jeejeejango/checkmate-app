
import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface TodoList {
  id: string;
  name: string;
  createdAt: Timestamp;
  owner: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Timestamp;
}
