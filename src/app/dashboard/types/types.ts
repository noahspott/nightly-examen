export type DatabaseSession = {
  completed_at: string;
};

export type StatsResponse = {
  streak: number;
  totalSessions: number;
  daysSinceLastConfession: number;
  weekCompletionStatus: boolean[];
};
