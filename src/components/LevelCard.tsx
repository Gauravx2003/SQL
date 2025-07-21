import React from 'react';
import { Lock, CheckCircle, Mountain, Trees, Sun, Waves, Rocket, Flame } from 'lucide-react';
import { Level } from '../data/levels';

interface LevelCardProps {
  level: Level;
  isLocked: boolean;
  onClick: () => void;
}

const getEnvironmentIcon = (environment: string) => {
  switch (environment.toLowerCase()) {
    case 'mountains': return <Mountain className="text-gray-400" size={20} />;
    case 'forest': return <Trees className="text-green-500" size={20} />;
    case 'desert': return <Sun className="text-yellow-500" size={20} />;
    case 'ocean': return <Waves className="text-blue-500" size={20} />;
    case 'space': return <Rocket className="text-purple-500" size={20} />;
    case 'volcano': return <Flame className="text-red-500" size={20} />;
    default: return <Mountain className="text-gray-400" size={20} />;
  }
};

const getEnvironmentGradient = (environment: string) => {
  switch (environment.toLowerCase()) {
    case 'mountains': return 'from-gray-700 to-gray-900';
    case 'forest': return 'from-green-700 to-green-900';
    case 'desert': return 'from-yellow-700 to-orange-900';
    case 'ocean': return 'from-blue-700 to-blue-900';
    case 'space': return 'from-purple-700 to-indigo-900';
    case 'volcano': return 'from-red-700 to-red-900';
    default: return 'from-gray-700 to-gray-900';
  }
};

export const LevelCard: React.FC<LevelCardProps> = ({ level, isLocked, onClick }) => {
  return (
    <div
      onClick={!isLocked ? onClick : undefined}
      className={`
        relative rounded-lg border transition-all duration-300 transform hover:scale-105
        ${isLocked 
          ? 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-50' 
          : `bg-gradient-to-br ${getEnvironmentGradient(level.environment)} border-gray-600 cursor-pointer hover:border-blue-400`
        }
        ${level.completed ? 'ring-2 ring-green-500' : ''}
      `}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getEnvironmentIcon(level.environment)}
            <div>
              <h3 className={`font-semibold ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                {level.name}
              </h3>
              <p className={`text-sm ${isLocked ? 'text-gray-600' : 'text-gray-400'}`}>
                {level.environment}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {level.completed && (
              <CheckCircle className="text-green-500" size={20} />
            )}
            {isLocked && (
              <Lock className="text-gray-500" size={20} />
            )}
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <div className={`text-sm ${isLocked ? 'text-gray-600' : 'text-gray-400'}`}>
            Required XP: {level.requiredXP}
          </div>
          <div className={`text-sm ${isLocked ? 'text-gray-600' : 'text-yellow-400'}`}>
            Reward: +{level.rewardXP} XP
          </div>
        </div>

        {/* Challenge Preview */}
        <div className="mt-4">
          <p className={`text-sm ${isLocked ? 'text-gray-600' : 'text-gray-300'} line-clamp-2`}>
            {level.problem.question}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <button
            disabled={isLocked}
            className={`
              w-full py-2 px-4 rounded-md text-sm font-medium transition-colors
              ${isLocked 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : level.completed
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            `}
          >
            {isLocked ? 'Locked' : level.completed ? 'Completed' : 'Start Challenge'}
          </button>
        </div>
      </div>
    </div>
  );
};