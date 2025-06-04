export interface UserProfile {
  commanderName: string;
  rankBadgeUrl?: string;
  rankProgressPercent: number;
  nextRank?: string;
}

export interface UserSystemStatus {
  starDate?: string;
  signalStatus: string;
  networkLoadPercent?: number;
  anomaliesResolved?: number;
}

export interface UserPublic {
  id: string;
  walletAddress: string;
  username: string;
  email?: string;
  rank: string;
  xp: number;
  referralCode?: string;
  alliesCount: number;
  xConnected?: boolean;
  profile: UserProfile;
  systemStatus?: UserSystemStatus;
  lastLogin?: string;
  createdAt: string;
}

export interface AllyInfo {
  id: string;
  username: string;
  rank: string;
  joinedAt: string;
}

export interface AlliesListResponse {
  totalAllies: number;
  allies: AllyInfo[];
  page: number;
  limit: number;
  totalPages: number;
}