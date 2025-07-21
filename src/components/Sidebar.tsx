import React from 'react';
import { Trophy, Zap, Target } from 'lucide-react';
import { PlayerState, getPlayerLevel, getXpForNextLevel } from '../data/player';

interface SidebarProps {
  player: PlayerState;
}

export const Sidebar: React.FC<SidebarProps> = ({ player }) => {
  const currentLevel = getPlayerLevel(player.xp);
  const xpForNext = getXpForNextLevel(player.xp);
  const progress = xpForNext > 0 ? ((player.xp % 100) / 100) * 100 : 100;

  return (
    <div className="bg-gray-900 text-white p-6 h-screen w-80 border-r border-gray-700">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-400 mb-2">SQL Quest</h1>
        <p className="text-gray-400">Master SQL one level at a time</p>
      </div>

      <div className="space-y-6">
        {/* Player Level */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="text-yellow-500" size={24} />
            <div>
              <h3 className="font-semibold">Level {currentLevel}</h3>
              <p className="text-sm text-gray-400">SQL Apprentice</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {xpForNext > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              {xpForNext} XP to next level
            </p>
          )}
        </div>

        {/* XP Stats */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-blue-400" size={24} />
            <div>
              <h3 className="font-semibold">Experience Points</h3>
              <p className="text-2xl font-bold text-blue-400">{player.xp}</p>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Target className="text-green-400" size={24} />
            <div>
              <h3 className="font-semibold">Levels Completed</h3>
              <p className="text-2xl font-bold text-green-400">{player.completedLevels.length}</p>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg p-4 border border-purple-500/30">
          <h3 className="font-semibold text-purple-400 mb-2">Quick Tips</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Use SELECT * to get all columns</li>
            <li>• WHERE clause filters results</li>
            <li>• Don't forget semicolons!</li>
            <li>• JOIN connects tables together</li>
          </ul>
        </div>
      </div>
    </div>
  );
};