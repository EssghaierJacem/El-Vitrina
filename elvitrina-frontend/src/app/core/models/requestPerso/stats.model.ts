export interface Stats {
    totalRequests: number;
    totalProposals: number;
    requestsByDate: { [key: string]: number }; // Changed to dictionary type
    proposalsByDate: { [key: string]: number }; // Changed to dictionary type
  }
  
  export interface ChartData {
    name: string;
    value: number;
  }