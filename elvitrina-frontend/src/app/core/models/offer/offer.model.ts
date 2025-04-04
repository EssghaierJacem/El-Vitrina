export interface Offer {
    id?: number;
    name: string;
    description: string;
    discount: number;
    startDate: string;  
    endDate: string;    
    offer?: 'BUYERSERVICE' | 'SELLERSERVICE' | 'INVESTORSERVICE';    
    userId: number;     
  }
  