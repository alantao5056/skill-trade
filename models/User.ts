export interface User {
  uid: string;
  cycles: string[];
  edges: string[];
  offer: Record<string, number>;
  need: Record<string, number>;
}