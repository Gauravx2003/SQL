import React, { useEffect, useRef, useState } from 'react';
import { GameManager } from '../game/GameManager';
import { SQLChallenge } from './SQLChallenge';
import { GameLevel, PlayerState } from '../data/gameData';

export const GameContainer: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameManagerRef = useRef<GameManager | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<GameLevel | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    xp: 0,
    level: 1,
    currentWorld: 'mountains',
    completedLevels: []
  });

  useEffect(() => {
    if (gameRef.current && !gameManagerRef.current) {
      // Initialize Phaser game
      gameManagerRef.current = new GameManager('phaser-game');
      
      // Set up callbacks
      gameManagerRef.current.setLevelEnterCallback((level: GameLevel) => {
        setCurrentChallenge(level);
      });

      gameManagerRef.current.setPlayerStateChangeCallback((state: PlayerState) => {
        setPlayerState(state);
      });
    }

    return () => {
      if (gameManagerRef.current) {
        gameManagerRef.current.destroy();
        gameManagerRef.current = null;
      }
    };
  }, []);

  const handleChallengeComplete = (levelId: number, xpGained: number) => {
    if (gameManagerRef.current) {
      gameManagerRef.current.completeLevel(levelId, xpGained);
    }
  };

  const handleChallengeClose = () => {
    setCurrentChallenge(null);
  };

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* Game Instructions */}
      <div className="absolute top-4 right-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
        <h3 className="text-white font-semibold mb-2">Controls</h3>
        <div className="text-sm text-gray-300 space-y-1">
          <div>• Arrow keys to move</div>
          <div>• ENTER to start challenge</div>
          <div>• Walk to glowing portals</div>
        </div>
      </div>

      {/* Player Stats HUD */}
      <div className="absolute top-4 left-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
        <div className="text-white space-y-2">
          <div className="text-lg font-bold">SQL Quest</div>
          <div className="text-sm text-gray-300">
            Level {playerState.level} • {playerState.xp} XP
          </div>
          <div className="text-sm text-gray-300">
            Completed: {playerState.completedLevels.length} levels
          </div>
        </div>
      </div>

      {/* Phaser Game Container */}
      <div 
        id="phaser-game" 
        ref={gameRef}
        className="w-full h-full flex items-center justify-center"
      />

      {/* SQL Challenge Overlay */}
      {currentChallenge && (
        <SQLChallenge
          level={currentChallenge}
          isOpen={!!currentChallenge}
          onClose={handleChallengeClose}
          onComplete={handleChallengeComplete}
        />
      )}
    </div>
  );
};