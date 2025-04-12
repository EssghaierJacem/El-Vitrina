export interface Quiz {
  id?: number;             // Optionnel lors de la création
  title: string;
  description: string;
  score: number;
  userId: number;
}
