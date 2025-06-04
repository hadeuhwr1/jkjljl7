import React from 'react';
import { Trophy, Zap, Users, MessageSquare, Timer, Target, Award, Sparkles } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: {
    xp: number;
    badge?: string;
  };
  status: 'pending' | 'completed';
  type: 'social' | 'engagement' | 'community';
  deadline?: string;
  action: {
    label: string;
    url: string;
  };
}

const quests: Quest[] = [
  {
    id: 'q1',
    title: 'Establish Telegram Nexus Link',
    description: 'Sync consciousness with the collective hive mind via Telegram protocol.',
    reward: { xp: 500, badge: 'Signal Pioneer' },
    status: 'pending',
    type: 'social',
    action: {
      label: 'Initialize Link',
      url: '#'
    }
  },
  {
    id: 'q2',
    title: 'X-Signal Amplification',
    description: 'Extend neural pathways through X (formerly Twitter) network.',
    reward: { xp: 300 },
    status: 'completed',
    type: 'social',
    action: {
      label: 'Verify Signal',
      url: '#'
    }
  },
  {
    id: 'q3',
    title: 'Quantum Hash Propagation',
    description: 'Broadcast #CIGAR quantum signature across dimensional planes.',
    reward: { xp: 400, badge: 'Void Speaker' },
    status: 'pending',
    type: 'engagement',
    action: {
      label: 'Initiate Broadcast',
      url: '#'
    }
  },
  {
    id: 'q4',
    title: 'Neural Network Expansion',
    description: 'Assimilate 3 conscious entities into the collective.',
    reward: { xp: 1000, badge: 'Mind Weaver' },
    status: 'pending',
    type: 'community',
    deadline: '48:00:00',
    action: {
      label: 'Begin Assimilation',
      url: '#'
    }
  }
];

const badges = [
  { id: 'b1', name: 'Plasma Initiate', icon: <Award size={24} /> },
  { id: 'b2', name: 'Signal Pioneer', icon: <Zap size={24} /> },
  { id: 'b3', name: 'Void Speaker', icon: <MessageSquare size={24} /> },
];

const MissionTerminal: React.FC = () => {
  const completedQuests = quests.filter(q => q.status === 'completed').length;
  const totalQuests = quests.length;
  const progress = (completedQuests / totalQuests) * 100;

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Mission Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900/80 border border-purple-500/20 backdrop-blur-sm p-3 sm:p-5 h-full flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-green-400"></div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-orbitron font-bold text-white flex items-center gap-2">
                  <Target size={18} className="text-purple-400" />
                  Operation Status
                </h2>
                <div className="text-xs font-mono text-gray-400">
                  CODENAME: VAPOR WALKER
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-cyan-400">{completedQuests} / {totalQuests} Directives Executed</span>
                  <span className="text-gray-400">{progress.toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-green-400 transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="w-full h-full opacity-50 animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-mono italic">
                  Synchronize with Terran frequencies to unlock Plasma-tier clearance
                </div>
              </div>

              {/* Operation Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/30 rounded-lg p-3 border border-purple-900/30">
                  <div className="text-xs font-mono text-gray-400 mb-1">ACTIVE SIGNALS</div>
                  <div className="text-xl font-orbitron font-bold text-cyan-400">42</div>
                  <div className="mt-1 text-xs font-mono text-gray-500">DETECTED</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3 border border-purple-900/30">
                  <div className="text-xs font-mono text-gray-400 mb-1">QUANTUM FLUX</div>
                  <div className="text-xl font-orbitron font-bold text-purple-400">87%</div>
                  <div className="mt-1 text-xs font-mono text-gray-500">STABILITY</div>
                </div>
              </div>

              <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-lg font-orbitron text-sm text-white relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-cyan-500/40 to-green-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <Sparkles size={16} className="text-cyan-400" />
                  <span>Continue Operation</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900/80 border border-purple-500/20 backdrop-blur-sm p-3 sm:p-5 h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-green-400"></div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-orbitron font-bold text-white flex items-center gap-2">
                  <Trophy size={18} className="text-cyan-400" />
                  Neural Imprints
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {badges.map(badge => (
                  <div key={badge.id} className="bg-gray-800/50 rounded-lg p-3 border border-purple-900/30 flex items-center gap-3">
                    <div className="text-cyan-400">{badge.icon}</div>
                    <span className="font-mono text-gray-300 text-sm">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quest Feed */}
      <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900/80 border border-purple-500/20 backdrop-blur-sm p-3 sm:p-5">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-green-400"></div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-orbitron font-bold text-white flex items-center gap-2">
              <Zap size={18} className="text-green-400" />
              Active Directives
            </h2>
          </div>

          <div className="grid gap-4">
            {quests.map(quest => (
              <div 
                key={quest.id}
                className="bg-gray-800/30 rounded-lg p-4 border border-purple-900/30 relative group hover:bg-gray-800/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-orbitron text-white">{quest.title}</h3>
                      {quest.status === 'completed' && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-[10px] font-mono text-green-400 rounded-full">
                          COMPLETED
                        </span>
                      )}
                      {quest.deadline && (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-[10px] font-mono text-purple-400 rounded-full flex items-center gap-1">
                          <Timer size={10} />
                          {quest.deadline}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 font-mono">{quest.description}</p>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-cyan-400">+{quest.reward.xp} XP</span>
                      {quest.reward.badge && (
                        <span className="text-purple-400 flex items-center gap-1">
                          <Award size={12} />
                          {quest.reward.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    className={`px-4 py-2 rounded-lg font-orbitron text-sm relative group overflow-hidden
                      ${quest.status === 'completed' 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white'}`}
                  >
                    {quest.status !== 'completed' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-cyan-500/40 to-green-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    )}
                    <span className="relative">{quest.status === 'completed' ? 'Completed' : quest.action.label}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionTerminal;