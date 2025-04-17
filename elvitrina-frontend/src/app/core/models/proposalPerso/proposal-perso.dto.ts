export interface ProposalPersoDTO {
    id?: number;
    requestPersoId: number;
    description: string;
    price: number;
    date?: Date;
    userId: number;
    user?: UserDTO;
  }
  
  export interface UserDTO {
    id: number;
    name: string;
    email: string;
    image?: string;
  }