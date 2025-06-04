// ===========================================================================
// File: src/types/user.ts (MODIFIKASI: Tambahkan tipe AllyInfo dan AlliesListResponse)
// Deskripsi: Definisi tipe untuk data pengguna.
// ===========================================================================
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
  alliesCount: number; // Jumlah total sekutu yang dimiliki user ini
  profile: UserProfile;
  systemStatus?: UserSystemStatus;
  lastLogin?: string;
  createdAt: string;
}

// Tipe baru untuk informasi sekutu
export interface AllyInfo {
  id: string; // ID dari user yang direferensikan
  username: string;
  rank: string;
  joinedAt: string; // createdAt dari user yang direferensikan (dalam format ISO string)
}

// Tipe baru untuk respons daftar sekutu dari API
export interface AlliesListResponse {
  totalAllies: number;
  allies: AllyInfo[];
  page: number;
  limit: number;
  totalPages: number;
}