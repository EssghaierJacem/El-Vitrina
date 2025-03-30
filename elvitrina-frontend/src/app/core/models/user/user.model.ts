export interface User {
    id?: number;
    name?: string;
    lastname?: string;
    firstname?: string;
    email: string;
    phone?: string;
    address?: string;
    image?:string;
    registrationDate?: string; 
    status?: boolean;
    points?: number;
    password?: string;
    isActive?: boolean;
    role?: 'ADMIN' | 'USER' | 'MODERATOR'; 
  }
  