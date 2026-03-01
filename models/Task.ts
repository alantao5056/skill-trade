export interface Task {
  type: "add" | "remove";
  from: string;
  to: string;
  uid: string;
  edgeId: string;
  createdAt: number;
}