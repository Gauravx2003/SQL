export interface PlayerState {
  xp: number;
  currentLevel: number;
  completedLevels: number[];
}

export const initialPlayerState: PlayerState = {
  xp: 0,
  currentLevel: 1,
  completedLevels: []
};

export const getPlayerLevel = (xp: number): number => {
  if (xp >= 850) return 7;
  if (xp >= 550) return 6;
  if (xp >= 350) return 5;
  if (xp >= 225) return 4;
  if (xp >= 125) return 3;
  if (xp >= 50) return 2;
  return 1;
};

export const getXpForNextLevel = (currentXp: number): number => {
  const thresholds = [50, 125, 225, 350, 550, 850];
  for (const threshold of thresholds) {
    if (currentXp < threshold) {
      return threshold - currentXp;
    }
  }
  return 0; // Max level reached
};