export interface Stats {
  totalRequests: number;
  totalProposals: number;
  activeUsers: number;
  requestsByDate: Record<string, number>;
  proposalsByDate: Record<string, number>;
  requestsByStatus: Record<string, number>;
  topRequesters: [string, number][]; // [userId, count]
  topProposers: [string, number][]; // [userId, count]
}

export interface SeriesItem {
  name: string;
  value: number;
}

export interface SeriesData {
  name: string;
  series: SeriesItem[];
}

export interface ChartData {
  requestsByDate: SeriesData[];
  proposalsByDate: SeriesData[];
  requestsByStatus: SeriesItem[];
}