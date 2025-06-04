import React from 'react';
import { Twitter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const XConnectButton: React.FC = () => {
  const { user, isAuthenticated, connectX, isConnectingX } = useAuth();

  const handleConnect = () => {
    if (!isAuthenticated) {
      return;
    }
    connectX();
  };

  if (!isAuthenticated) {
    return null;
  }

  if (user?.xConnected) {
    return (
      <button
        className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 border border-cyan-500/30 rounded-lg"
        disabled
      >
        <Twitter size={18} className="text-cyan-400" />
        <span className="font-orbitron tracking-wide text-sm text-white">X Connected</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnectingX}
      className="relative overflow-hidden group flex items-center gap-2 px-4 py-2 bg-gray-800/80 border border-purple-500/30 rounded-lg hover:bg-gray-700/80 transition-colors"
    >
      <Twitter size={18} className="text-purple-400 group-hover:text-cyan-400 transition-colors" />
      <span className="font-orbitron tracking-wide text-sm text-white">
        {isConnectingX ? 'Connecting...' : 'Connect X'}
      </span>
    </button>
  );
};

export default XConnectButton;