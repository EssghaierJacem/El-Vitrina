export interface Quiz {
  id?: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  bonneReponse: string;
  reponseUser?: string;
  score: number;
  userId?: number;
}
