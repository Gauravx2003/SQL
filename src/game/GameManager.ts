import Phaser from 'phaser';
import { GameScene } from './GameScene';

export class GameManager {
  private game: Phaser.Game;
  private gameScene: GameScene | null = null;
  private pendingCallbacks: {
    onLevelEnter?: (level: any) => void;
    onPlayerStateChange?: (state: any) => void;
  } = {};

  constructor(containerId: string) {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1200,
      height: 600,
      parent: containerId,
      backgroundColor: '#1F2937',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0, x: 0 },
          debug: false
        }
      },
      scene: GameScene
    };

    this.game = new Phaser.Game(config);
    
    // Wait for the game to be ready before accessing the scene
    this.game.events.once('ready', () => {
      this.gameScene = this.game.scene.getScene('GameScene') as GameScene;
      
      // Apply any pending callbacks
      if (this.pendingCallbacks.onLevelEnter) {
        this.gameScene.onLevelEnter = this.pendingCallbacks.onLevelEnter;
      }
      if (this.pendingCallbacks.onPlayerStateChange) {
        this.gameScene.onPlayerStateChange = this.pendingCallbacks.onPlayerStateChange;
      }
    });
  }

  public setLevelEnterCallback(callback: (level: any) => void) {
    if (this.gameScene) {
      this.gameScene.onLevelEnter = callback;
    } else {
      this.pendingCallbacks.onLevelEnter = callback;
    }
  }

  public setPlayerStateChangeCallback(callback: (state: any) => void) {
    if (this.gameScene) {
      this.gameScene.onPlayerStateChange = callback;
    } else {
      this.pendingCallbacks.onPlayerStateChange = callback;
    }
  }

  public completeLevel(levelId: number, xpGained: number) {
    if (this.gameScene) {
      this.gameScene.completeLevel(levelId, xpGained);
    }
  }

  public destroy() {
    this.game.destroy(true);
  }
}