export interface User {
  uid: string;
  displayName?: string;
  cycles: string[];
  edges: string[];
  offer: Record<string, number>;
  need: Record<string, number>;
}