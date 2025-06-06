export interface Item {
  id: number;
  name: string;
  ownerId: number;
}

export interface User {
  id: number;
  name: string;
  acceptedGTC?: boolean;
  acceptedFircleRules?: number[];
}
