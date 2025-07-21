import Phaser from 'phaser';
import { gameWorlds, GameLevel, PlayerState } from '../data/gameData';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private levels: Phaser.Physics.Arcade.Group;
  private currentWorld = gameWorlds[0]; // Start with Mountains
  private playerState: PlayerState;
  private xpText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private interactionText!: Phaser.GameObjects.Text;
  private nearLevel: GameLevel | null = null;

  // Callback to communicate with React
  public onLevelEnter?: (level: GameLevel) => void;
  public onPlayerStateChange?: (state: PlayerState) => void;

  constructor() {
    super({ key: 'GameScene' });
    
    // Load player state from localStorage
    const saved = localStorage.getItem('sql-game-player');
    this.playerState = saved ? JSON.parse(saved) : {
      xp: 0,
      level: 1,
      currentWorld: 'mountains',
      completedLevels: []
    };
    
    this.levels = new Phaser.Physics.Arcade.Group(this);
  }

  preload() {
    // Create simple colored rectangles for sprites
    this.load.image('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('level-portal', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create() {
    // Set world bounds
    this.physics.world.setBounds(0, 0, 1200, 600);

    // Create background
    this.add.rectangle(600, 300, 1200, 600, 0x4A5568);
    
    // Add some mountain-like shapes for atmosphere
    this.createMountainBackground();

    // Create player
    this.player = this.physics.add.sprite(
      this.currentWorld.playerStartX, 
      this.currentWorld.playerStartY, 
      'player'
    );
    this.player.setDisplaySize(32, 32);
    this.player.setTint(0x3B82F6); // Blue player
    this.player.setCollideWorldBounds(true);

    // Create level portals
    this.createLevelPortals();

    // Setup controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Create HUD
    this.createHUD();

    // Setup physics
    this.physics.add.overlap(this.player, this.levels, this.handleLevelProximity, undefined, this);

    // Update level states based on player progress
    this.updateLevelStates();
  }

  private createMountainBackground() {
    // Create simple mountain silhouettes
    const mountains = [
      { x: 200, y: 500, width: 300, height: 200 },
      { x: 400, y: 480, width: 250, height: 180 },
      { x: 600, y: 520, width: 280, height: 160 },
      { x: 900, y: 490, width: 320, height: 190 }
    ];

    mountains.forEach(mountain => {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x2D3748);
      graphics.fillTriangle(
        mountain.x - mountain.width/2, mountain.y,
        mountain.x + mountain.width/2, mountain.y,
        mountain.x, mountain.y - mountain.height
      );
    });
  }

  private createLevelPortals() {
    this.currentWorld.levels.forEach(levelData => {
      const portal = this.physics.add.sprite(levelData.x, levelData.y, 'level-portal');
      portal.setDisplaySize(48, 48);
      
      // Set portal appearance based on state
      if (levelData.completed) {
        portal.setTint(0x10B981); // Green for completed
      } else if (levelData.unlocked) {
        portal.setTint(0xF59E0B); // Yellow for available
        // Add glowing effect
        this.tweens.add({
          targets: portal,
          alpha: 0.7,
          duration: 1000,
          yoyo: true,
          repeat: -1
        });
      } else {
        portal.setTint(0x6B7280); // Gray for locked
        portal.setAlpha(0.5);
      }

      // Store level data in the sprite
      (portal as any).levelData = levelData;
      this.levels.add(portal);

      // Add level name text
      const nameText = this.add.text(levelData.x, levelData.y - 40, levelData.name, {
        fontSize: '14px',
        color: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5);

      if (!levelData.unlocked) {
        nameText.setAlpha(0.5);
      }
    });
  }

  private createHUD() {
    // XP Bar background
    const xpBarBg = this.add.rectangle(150, 30, 200, 20, 0x374151);
    xpBarBg.setStrokeStyle(2, 0x6B7280);

    // XP Bar fill
    const xpBarFill = this.add.rectangle(50, 30, 0, 16, 0x10B981);
    xpBarFill.setOrigin(0, 0.5);

    // Update XP bar
    const currentLevelXP = this.getXPForCurrentLevel();
    const nextLevelXP = this.getXPForNextLevel();
    const progress = currentLevelXP / (nextLevelXP || 1);
    xpBarFill.width = 200 * progress;

    // HUD Text
    this.xpText = this.add.text(20, 60, `XP: ${this.playerState.xp}`, {
      fontSize: '18px',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 2
    });

    this.levelText = this.add.text(20, 85, `Level: ${this.getPlayerLevel()}`, {
      fontSize: '18px',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 2
    });

    // Interaction hint
    this.interactionText = this.add.text(600, 550, '', {
      fontSize: '16px',
      color: '#F59E0B',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setVisible(false);
  }

  private handleLevelProximity = (player: any, levelPortal: any) => {
    const levelData = levelPortal.levelData as GameLevel;
    
    if (levelData.unlocked) {
      this.nearLevel = levelData;
      this.interactionText.setText(`Press ENTER to start: ${levelData.name}`);
      this.interactionText.setVisible(true);
    } else {
      this.nearLevel = null;
      this.interactionText.setText('Level Locked - Need more XP!');
      this.interactionText.setVisible(true);
    }
  };

  update() {
    // Player movement
    const speed = 200;
    
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    } else {
      this.player.setVelocityY(0);
    }

    // Check if player is near any level
    let nearAnyLevel = false;
    this.levels.children.entries.forEach(levelSprite => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        levelSprite.x, levelSprite.y
      );
      
      if (distance < 60) {
        nearAnyLevel = true;
      }
    });

    if (!nearAnyLevel) {
      this.nearLevel = null;
      this.interactionText.setVisible(false);
    }

    // Handle Enter key
    if (Phaser.Input.Keyboard.JustDown(this.enterKey) && this.nearLevel) {
      if (this.nearLevel.unlocked && this.onLevelEnter) {
        this.onLevelEnter(this.nearLevel);
      }
    }
  }

  public completeLevel(levelId: number, xpGained: number) {
    // Update player state
    this.playerState.xp += xpGained;
    this.playerState.completedLevels.push(levelId);
    this.playerState.level = this.getPlayerLevel();

    // Save to localStorage
    localStorage.setItem('sql-game-player', JSON.stringify(this.playerState));

    // Update HUD
    this.updateHUD();

    // Update level states and unlock next levels
    this.updateLevelStates();

    // Notify React component
    if (this.onPlayerStateChange) {
      this.onPlayerStateChange(this.playerState);
    }

    // Show XP gain animation
    this.showXPGainAnimation(xpGained);
  }

  private updateLevelStates() {
    // Update level unlock states based on XP
    this.currentWorld.levels.forEach(level => {
      const requiredXP = (level.id - 1) * 100; // Simple progression
      level.unlocked = this.playerState.xp >= requiredXP;
      level.completed = this.playerState.completedLevels.includes(level.id);
    });

    // Update portal appearances
    this.levels.children.entries.forEach(portalSprite => {
      const levelData = (portalSprite as any).levelData as GameLevel;
      
      if (levelData.completed) {
        portalSprite.setTint(0x10B981);
        portalSprite.setAlpha(1);
      } else if (levelData.unlocked) {
        portalSprite.setTint(0xF59E0B);
        portalSprite.setAlpha(1);
      } else {
        portalSprite.setTint(0x6B7280);
        portalSprite.setAlpha(0.5);
      }
    });
  }

  private updateHUD() {
    this.xpText.setText(`XP: ${this.playerState.xp}`);
    this.levelText.setText(`Level: ${this.getPlayerLevel()}`);
  }

  private showXPGainAnimation(xp: number) {
    const xpGainText = this.add.text(this.player.x, this.player.y - 50, `+${xp} XP!`, {
      fontSize: '20px',
      color: '#10B981',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.tweens.add({
      targets: xpGainText,
      y: xpGainText.y - 50,
      alpha: 0,
      duration: 1500,
      onComplete: () => xpGainText.destroy()
    });
  }

  private getPlayerLevel(): number {
    if (this.playerState.xp >= 1000) return 5;
    if (this.playerState.xp >= 600) return 4;
    if (this.playerState.xp >= 300) return 3;
    if (this.playerState.xp >= 100) return 2;
    return 1;
  }

  private getXPForCurrentLevel(): number {
    const level = this.getPlayerLevel();
    const thresholds = [0, 100, 300, 600, 1000];
    return this.playerState.xp - (thresholds[level - 1] || 0);
  }

  private getXPForNextLevel(): number {
    const level = this.getPlayerLevel();
    const thresholds = [100, 300, 600, 1000, 2000];
    const current = thresholds[level - 1] || 0;
    const next = thresholds[level] || 2000;
    return next - current;
  }
}