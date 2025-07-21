// Game configuration and level data
export interface SQLChallenge {
  id: number;
  title: string;
  description: string;
  schema: string;
  sampleData: any[];
  expectedResult: any[];
  hints: string[];
  rewardXP: number;
}

export interface GameLevel {
  id: number;
  name: string;
  x: number;
  y: number;
  unlocked: boolean;
  completed: boolean;
  challenge: SQLChallenge;
}

export interface GameWorld {
  id: string;
  name: string;
  background: string;
  playerStartX: number;
  playerStartY: number;
  levels: GameLevel[];
}

export const gameWorlds: GameWorld[] = [
  {
    id: 'mountains',
    name: 'Crystal Mountains',
    background: '#4A5568',
    playerStartX: 100,
    playerStartY: 400,
    levels: [
      {
        id: 1,
        name: 'Basic SELECT',
        x: 300,
        y: 350,
        unlocked: true,
        completed: false,
        challenge: {
          id: 1,
          title: 'Your First Query',
          description: 'Select all students from the database to see who\'s enrolled.',
          schema: 'CREATE TABLE students (id INTEGER, name TEXT, age INTEGER, grade TEXT);',
          sampleData: [
            { id: 1, name: 'Alice', age: 20, grade: 'A' },
            { id: 2, name: 'Bob', age: 22, grade: 'B' },
            { id: 3, name: 'Charlie', age: 21, grade: 'A' },
            { id: 4, name: 'Diana', age: 23, grade: 'C' }
          ],
          expectedResult: [
            { id: 1, name: 'Alice', age: 20, grade: 'A' },
            { id: 2, name: 'Bob', age: 22, grade: 'B' },
            { id: 3, name: 'Charlie', age: 21, grade: 'A' },
            { id: 4, name: 'Diana', age: 23, grade: 'C' }
          ],
          hints: [
            'Use SELECT * to get all columns',
            'Don\'t forget the table name after FROM',
            'End your query with a semicolon'
          ],
          rewardXP: 100
        }
      },
      {
        id: 2,
        name: 'WHERE Filtering',
        x: 500,
        y: 300,
        unlocked: false,
        completed: false,
        challenge: {
          id: 2,
          title: 'Filter the Results',
          description: 'Find all students who have an A grade.',
          schema: 'CREATE TABLE students (id INTEGER, name TEXT, age INTEGER, grade TEXT);',
          sampleData: [
            { id: 1, name: 'Alice', age: 20, grade: 'A' },
            { id: 2, name: 'Bob', age: 22, grade: 'B' },
            { id: 3, name: 'Charlie', age: 21, grade: 'A' },
            { id: 4, name: 'Diana', age: 23, grade: 'C' }
          ],
          expectedResult: [
            { id: 1, name: 'Alice', age: 20, grade: 'A' },
            { id: 3, name: 'Charlie', age: 21, grade: 'A' }
          ],
          hints: [
            'Use WHERE clause to filter results',
            'Compare grade with = operator',
            'String values need quotes: \'A\''
          ],
          rewardXP: 150
        }
      },
      {
        id: 3,
        name: 'ORDER BY',
        x: 700,
        y: 250,
        unlocked: false,
        completed: false,
        challenge: {
          id: 3,
          title: 'Sort the Data',
          description: 'Get all students ordered by age from youngest to oldest.',
          schema: 'CREATE TABLE students (id INTEGER, name TEXT, age INTEGER, grade TEXT);',
          sampleData: [
            { id: 1, name: 'Alice', age: 20, grade: 'A' },
            { id: 2, name: 'Bob', age: 22, grade: 'B' },
            { id: 3, name: 'Charlie', age: 21, grade: 'A' },
            { id: 4, name: 'Diana', age: 23, grade: 'C' }
          ],
          expectedResult: [
            { id: 1, name: 'Alice', age: 20, grade: 'A' },
            { id: 3, name: 'Charlie', age: 21, grade: 'A' },
            { id: 2, name: 'Bob', age: 22, grade: 'B' },
            { id: 4, name: 'Diana', age: 23, grade: 'C' }
          ],
          hints: [
            'Use ORDER BY clause after WHERE (if any)',
            'ASC for ascending (default), DESC for descending',
            'Order by the age column'
          ],
          rewardXP: 200
        }
      }
    ]
  }
];

export interface PlayerState {
  xp: number;
  level: number;
  currentWorld: string;
  completedLevels: number[];
}

export const initialPlayerState: PlayerState = {
  xp: 0,
  level: 1,
  currentWorld: 'mountains',
  completedLevels: []
};

export const getPlayerLevel = (xp: number): number => {
  if (xp >= 1000) return 5;
  if (xp >= 600) return 4;
  if (xp >= 300) return 3;
  if (xp >= 100) return 2;
  return 1;
};