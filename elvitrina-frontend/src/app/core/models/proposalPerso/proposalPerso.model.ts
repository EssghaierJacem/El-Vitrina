import { RequestPerso } from '../requestPerso/requestPerso.model';

export interface ProposalPerso {
  id: number;
  requestPerso: RequestPerso; // nested reference (can be optional or minimal depending on your usage)
  // title: string;
  description: string;
  price: number;
  // image: string;
  date: string; // ISO 8601 format: e.g., '2025-04-05T12:00:00'
}
