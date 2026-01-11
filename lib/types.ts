export interface Child {
  id: string;
  name: string;
  age: number;
}

export type Status = 'active' | 'inactive' | 'pending';

export interface Parent {
  id: string;
  name: string;
  email: string;
  status: Status;
  children: Child[];
  tasksCompleted: number;
}
export interface DashboardStats {
  totalFamilies: number;
  activeParents: number;
  totalChildren: number;
  completedTasks: number;
}