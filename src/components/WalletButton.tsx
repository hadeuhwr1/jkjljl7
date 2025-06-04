// ===========================================================================
// File: src/components/WalletButton.tsx (MODIFIKASI)
// Deskripsi: Mengintegrasikan WalletButton dengan AuthContext.
// ===========================================================================
import React from 'react'; // useState dihapus karena state diambil dari context
import { Wallet, LogOut, UserCircle, Loader2 } from 'lucide-react'; // Menambahkan LogOut, UserCircle, Loader2
import { useAuth } from '../contexts/AuthContext'; // Menggunakan AuthContext

const WalletButton: React.FC = () => {
  const { isAuthenticated, user, isLoading, connectWallet, logout } = useAuth();
  // const [isHovered, setIsHovered] = useState(false); // Ini untuk efek visual, bisa dipertahankan

  const handleConnect = () => {
    if (!isLoading) {
      connectWallet();
    }
  };

  const handleLogout = () => {
    if (!isLoading) {
      logout();
    }
  };

  if (isLoading) {
    return (
      <button
        className="relative overflow-hidden group flex items-center justify-center px-5 py-2.5 bg-gray-800/80 border border-purple-500/30 rounded-lg cursor-wait"
        disabled
      >
        <Loader2 size={18} className="text-cyan-400 animate-spin mr-2" />
        <span className="font-orbitron tracking-wide text-sm text-white">
          Memproses...
        </span>
      </button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative flex items-center gap-2 px-4 py-2 bg-gray-800/80 border border-cyan-500/30 rounded-lg">
          <UserCircle size={18} className="text-cyan-400" />
          <span className="font-orbitron tracking-wide text-sm text-white truncate max-w-[100px] sm:max-w-[150px]" title={user.username}>
            {user.username}
          </span>
          {/* Anda bisa menambahkan info rank atau XP di sini jika mau */}
        </div>
        <button
          onClick={handleLogout}
          className="relative overflow-hidden group p-2.5 bg-red-700/80 hover:bg-red-600/90 border border-red-500/30 rounded-lg transition-colors duration-300"
          title="Logout"
        >
          <LogOut size={18} className="text-white" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="relative overflow-hidden group"
      // onMouseEnter={() => setIsHovered(true)} // Efek hover bisa diaktifkan lagi
      // onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-cyan-500 to-green-500 opacity-70 rounded-lg blur-md group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative flex items-center gap-2 px-5 py-2.5 bg-gray-900/90 border border-purple-500/30 rounded-lg z-10 transition-all duration-300">
        <Wallet 
          size={18} 
          className={`text-cyan-400`} // Efek pulse bisa ditambahkan lagi jika isHovered dipakai
        />
        <span className="font-orbitron tracking-wide text-sm text-white">
          Connect Wallet
        </span>
        <div className={`absolute inset-0 bg-gradient-to-r from-purple-900/40 to-cyan-900/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      </div>
    </button>
  );
};

export default WalletButton;