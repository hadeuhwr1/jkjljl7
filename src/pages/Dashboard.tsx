import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import WalletButton from '../components/WalletButton';
import PortfolioCard from '../components/PortfolioCard';
import MissionLog from '../components/MissionLog';
import NewsBar from '../components/NewsBar';
import MissionProgress from '../components/MissionProgress';
import AllyTracker from '../components/AllyTracker';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-30" style={{ 
          backgroundImage: 'url("https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750")', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'soft-light'
        }}></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Ambient lights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-green-600/10 rounded-full filter blur-3xl"></div>
      </div>

      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="relative flex-1 flex flex-col overflow-hidden">
        <header className="relative z-10 px-6 py-4 bg-gray-900/50 backdrop-blur-md border-b border-purple-900/30">
          <div className="flex justify-end">
            <WalletButton />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PortfolioCard />
            <MissionLog />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <MissionProgress />
            </div>
            <div className="lg:col-span-3">
              <AllyTracker />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900/80 border border-purple-500/20 backdrop-blur-sm p-5 lg:col-span-3">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-green-400"></div>
              
              <div className="text-center p-6">
                <h3 className="font-orbitron text-lg mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-green-400">
                  The $CIGAR Restoration Project
                </h3>
                <p className="text-gray-400 font-mono text-sm max-w-2xl mx-auto">
                  After the Krellnic Inversion, our civilization's future depends on rebuilding our ecosystem. 
                  Each $CIGAR token represents a quantum fragment of our collective memory and provides access 
                  to the reconstruction efforts. Stay tuned for upcoming governance proposals.
                </p>
              </div>
            </div>
          </div>
        </main>

        <NewsBar />
      </div>
    </div>
  );
};

export default Dashboard;