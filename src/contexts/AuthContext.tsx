import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../services/apiService';
import { UserPublic } from '../types/user';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserPublic | null;
  token: string | null;
  isLoading: boolean;
  isConnectingX: boolean;
  connectWallet: () => Promise<void>;
  connectX: () => Promise<void>;
  logout: () => void;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PENDING_REFERRAL_CODE_KEY = 'pending_referral_code';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserPublic | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnectingX, setIsConnectingX] = useState<boolean>(false);

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

  const connectX = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsConnectingX(true);
    try {
      const response = await apiClient.post('/auth/x/initiate-oauth');
      const { authUrl } = response.data;
      
      // Open X auth popup
      const width = 600;
      const height = 600;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      
      const popup = window.open(
        authUrl,
        'Connect X Account',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for messages from popup
      const messageHandler = async (event: MessageEvent) => {
        if (event.data?.type === 'x_auth_success') {
          window.removeEventListener('message', messageHandler);
          popup?.close();
          
          // Refresh user profile to get updated X connection status
          await fetchUserProfile();
          toast.success('X account connected successfully!');
        }
      };

      window.addEventListener('message', messageHandler);
    } catch (error: any) {
      console.error('Error connecting X account:', error);
      toast.error(error.response?.data?.detail || 'Failed to connect X account');
    } finally {
      setIsConnectingX(false);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    if (!(window as any).ethereum) {
      toast.error("MetaMask wallet not detected. Please install MetaMask.");
      setIsLoading(false);
      return;
    }

    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        toast.error("Failed to get wallet address.");
        setIsLoading(false);
        return;
      }
      const walletAddress = accounts[0];

      toast.loading("Requesting challenge from server...", { id: "auth-process" });
      const challengeResponse = await apiClient.get(`/auth/challenge`, { params: { walletAddress } });
      const { messageToSign, nonce } = challengeResponse.data;
      
      if (!messageToSign || !nonce) {
        toast.error("Failed to get challenge message from server.", { id: "auth-process" });
        setIsLoading(false);
        return;
      }

      toast.loading("Please sign the message in your wallet...", { id: "auth-process" });
      const signature = await (window as any).ethereum.request({
        method: 'personal_sign',
        params: [messageToSign, walletAddress],
      });

      if (!signature) {
        toast.error("Failed to sign message.", { id: "auth-process" });
        setIsLoading(false);
        return;
      }
      
      const pendingReferralCode = localStorage.getItem(PENDING_REFERRAL_CODE_KEY);

      toast.loading("Verifying signature...", { id: "auth-process" });
      const connectPayload: any = {
        walletAddress,
        message: messageToSign,
        signature,
        nonce,
      };

      if (pendingReferralCode) {
        connectPayload.referral_code_input = pendingReferralCode;
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
        toast.success(`Welcome, ${userData.username}!`, { id: "auth-process" });

        if (pendingReferralCode) {
          localStorage.removeItem(PENDING_REFERRAL_CODE_KEY);
        }
      } else {
        toast.error("Login failed. Incomplete data from server.", { id: "auth-process" });
      }

    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Error connecting wallet.";
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
    setIsLoading(true);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('cigar_ds_token');
    localStorage.removeItem('cigar_ds_user');
    delete apiClient.defaults.headers.common['Authorization'];
    toast.success("You have been logged out.");
    setIsLoading(false);
  };

  const fetchUserProfile = async () => {
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
      const errorMessage = error.response?.data?.detail || "Failed to fetch latest profile data.";
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        logout();
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      token, 
      isLoading,
      isConnectingX,
      connectWallet,
      connectX,
      logout, 
      fetchUserProfile 
    }}>
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