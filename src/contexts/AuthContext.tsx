// ===========================================================================
// File: src/context/AuthContext.tsx (MODIFIKASI)
// Deskripsi: Menambahkan logika untuk membaca dan mengirim kode referral.
// ===========================================================================
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../services/apiService';
import { UserPublic } from '../types/user'; // Pastikan path ini benar
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserPublic | null;
  token: string | null;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  logout: () => void;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PENDING_REFERRAL_CODE_KEY = 'pending_referral_code'; // Key untuk localStorage

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserPublic | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('cigar_ds_token');
    const storedUser = localStorage.getItem('cigar_ds_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        const parsedUser: UserPublic = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem('cigar_ds_token');
        localStorage.removeItem('cigar_ds_user');
      }
    }
    setIsLoading(false);
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    if (!(window as any).ethereum) {
      toast.error("Dompet MetaMask tidak terdeteksi. Silakan install MetaMask.");
      setIsLoading(false);
      return;
    }

    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        toast.error("Gagal mendapatkan alamat dompet.");
        setIsLoading(false);
        return;
      }
      const walletAddress = accounts[0];

      toast.loading("Meminta challenge dari server...", { id: "auth-process" });
      const challengeResponse = await apiClient.get(`/auth/challenge`, { params: { walletAddress } });
      const { messageToSign, nonce } = challengeResponse.data;
      
      if (!messageToSign || !nonce) {
        toast.error("Gagal mendapatkan challenge message dari server.", { id: "auth-process" });
        setIsLoading(false);
        return;
      }

      toast.loading("Silakan tandatangani pesan di dompet Anda...", { id: "auth-process" });
      const signature = await (window as any).ethereum.request({
        method: 'personal_sign',
        params: [messageToSign, walletAddress],
      });

      if (!signature) {
        toast.error("Gagal menandatangani pesan.", { id: "auth-process" });
        setIsLoading(false);
        return;
      }
      
      // Ambil kode referral yang mungkin tersimpan dari URL
      const pendingReferralCode = localStorage.getItem(PENDING_REFERRAL_CODE_KEY);

      toast.loading("Memverifikasi signature...", { id: "auth-process" });
      const connectPayload: any = { // Menggunakan any untuk sementara agar bisa tambah referral_code_input
        walletAddress,
        message: messageToSign,
        signature,
        nonce,
      };

      if (pendingReferralCode) {
        connectPayload.referral_code_input = pendingReferralCode;
        console.log("Mengirim dengan kode referral:", pendingReferralCode);
      }
      
      const connectResponse = await apiClient.post('/auth/connect', connectPayload);

      const { access_token, user: userData } = connectResponse.data;

      if (access_token && userData) {
        setToken(access_token);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('cigar_ds_token', access_token);
        localStorage.setItem('cigar_ds_user', JSON.stringify(userData));
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        toast.success(`Selamat datang, ${userData.username}!`, { id: "auth-process" });

        // Hapus kode referral dari localStorage setelah berhasil digunakan
        if (pendingReferralCode) {
          localStorage.removeItem(PENDING_REFERRAL_CODE_KEY);
          console.log("Kode referral yang tertunda telah digunakan dan dihapus.");
        }
      } else {
        toast.error("Login gagal. Data tidak lengkap dari server.", { id: "auth-process" });
      }

    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Terjadi kesalahan saat menghubungkan dompet.";
      // Jika error detail adalah array (dari Pydantic validation error), format dengan baik
      let displayErrorMessage = errorMessage;
      if (Array.isArray(errorMessage)) {
        displayErrorMessage = errorMessage.map((err: any) => `${err.loc?.join('->') || 'error'}: ${err.msg}`).join('; ');
      }
      toast.error(displayErrorMessage, { id: "auth-process" });
    } finally {
      setIsLoading(false);
      toast.dismiss("auth-process");
    }
  };

  const logout = () => {
    // ... (fungsi logout sama seperti sebelumnya) ...
    setIsLoading(true);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('cigar_ds_token');
    localStorage.removeItem('cigar_ds_user');
    // Tidak perlu hapus PENDING_REFERRAL_CODE_KEY saat logout, biarkan saja
    // agar jika user login lagi, kode referralnya masih bisa dipakai jika belum terpakai.
    delete apiClient.defaults.headers.common['Authorization'];
    toast.success("Anda telah logout.");
    setIsLoading(false);
  };

  const fetchUserProfile = async () => {
    // ... (fungsi fetchUserProfile sama seperti sebelumnya) ...
    if (!isAuthenticated || !token) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiClient.get('/users/me');
      const updatedUserData = response.data;
      setUser(updatedUserData);
      localStorage.setItem('cigar_ds_user', JSON.stringify(updatedUserData));
      console.info("User profile refreshed.");
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      const errorMessage = error.response?.data?.detail || "Gagal mengambil data profil terbaru.";
      if (error.response?.status === 401) {
        toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
        logout();
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, isLoading, connectWallet, logout, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};