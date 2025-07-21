export interface Level {
  id: number;
  name: string;
  environment: string;
  requiredXP: number;
  completed: boolean;
  problem: {
    question: string;
    schema: string;
    data: any[];
    expectedResult?: any[];
    hints?: string[];
  };
  rewardXP: number;
}

export const levels: Level[] = [
  {
    id: 1,
    name: "Basic SELECT",
    environment: "Mountains",
    requiredXP: 0,
    completed: false,
    problem: {
      question: "Select all rows from the Students table to see who's enrolled.",
      schema: "CREATE TABLE Students (id INTEGER, name TEXT, age INTEGER);",
      data: [
        { id: 1, name: "Alice", age: 22 },
        { id: 2, name: "Bob", age: 24 },
        { id: 3, name: "Charlie", age: 23 }
      ],
      expectedResult: [
        { id: 1, name: "Alice", age: 22 },
        { id: 2, name: "Bob", age: 24 },
        { id: 3, name: "Charlie", age: 23 }
      ],
      hints: ["Use SELECT * FROM table_name", "Don't forget the semicolon!"]
    },
    rewardXP: 50
  },
  {
    id: 2,
    name: "WHERE Clause",
    environment: "Forest",
    requiredXP: 50,
    completed: false,
    problem: {
      question: "Find all students who are older than 22 years.",
      schema: "CREATE TABLE Students (id INTEGER, name TEXT, age INTEGER);",
      data: [
        { id: 1, name: "Alice", age: 22 },
        { id: 2, name: "Bob", age: 24 },
        { id: 3, name: "Charlie", age: 23 },
        { id: 4, name: "Diana", age: 21 }
      ],
      expectedResult: [
        { id: 2, name: "Bob", age: 24 },
        { id: 3, name: "Charlie", age: 23 }
      ],
      hints: ["Use WHERE clause to filter results", "Compare age with > operator"]
    },
    rewardXP: 75
  },
  {
    id: 3,
    name: "ORDER BY",
    environment: "Desert",
    requiredXP: 125,
    completed: false,
    problem: {
      question: "Get all students ordered by age from youngest to oldest.",
      schema: "CREATE TABLE Students (id INTEGER, name TEXT, age INTEGER);",
      data: [
        { id: 1, name: "Alice", age: 22 },
        { id: 2, name: "Bob", age: 24 },
        { id: 3, name: "Charlie", age: 23 },
        { id: 4, name: "Diana", age: 21 }
      ],
      expectedResult: [
        { id: 4, name: "Diana", age: 21 },
        { id: 1, name: "Alice", age: 22 },
        { id: 3, name: "Charlie", age: 23 },
        { id: 2, name: "Bob", age: 24 }
      ],
      hints: ["Use ORDER BY clause", "ASC for ascending order (default)"]
    },
    rewardXP: 100
  },
  {
    id: 4,
    name: "COUNT Function",
    environment: "Ocean",
    requiredXP: 225,
    completed: false,
    problem: {
      question: "Count how many students are in the database.",
      schema: "CREATE TABLE Students (id INTEGER, name TEXT, age INTEGER);",
      data: [
        { id: 1, name: "Alice", age: 22 },
        { id: 2, name: "Bob", age: 24 },
        { id: 3, name: "Charlie", age: 23 },
        { id: 4, name: "Diana", age: 21 },
        { id: 5, name: "Eve", age: 25 }
      ],
      expectedResult: [
        { "COUNT(*)": 5 }
      ],
      hints: ["Use COUNT(*) function", "Aggregate functions don't need WHERE clause here"]
    },
    rewardXP: 125
  },
  {
    id: 5,
    name: "JOIN Operation",
    environment: "Space",
    requiredXP: 350,
    completed: false,
    problem: {
      question: "Join Students with Courses to show which student is taking which course.",
      schema: `
        CREATE TABLE Students (id INTEGER, name TEXT, age INTEGER);
        CREATE TABLE Enrollments (student_id INTEGER, course TEXT);
      `,
      data: [
        { table: "Students", rows: [
          { id: 1, name: "Alice", age: 22 },
          { id: 2, name: "Bob", age: 24 }
        ]},
        { table: "Enrollments", rows: [
          { student_id: 1, course: "Math" },
          { student_id: 2, course: "Physics" },
          { student_id: 1, course: "Chemistry" }
        ]}
      ],
      expectedResult: [
        { id: 1, name: "Alice", age: 22, student_id: 1, course: "Math" },
        { id: 1, name: "Alice", age: 22, student_id: 1, course: "Chemistry" },
        { id: 2, name: "Bob", age: 24, student_id: 2, course: "Physics" }
      ],
      hints: ["Use INNER JOIN", "Join condition: Students.id = Enrollments.student_id"]
    },
    rewardXP: 200
  },
  {
    id: 6,
    name: "GROUP BY Challenge",
    environment: "Volcano",
    requiredXP: 550,
    completed: false,
    problem: {
      question: "Find the average age of students grouped by their course enrollment count.",
      schema: `
        CREATE TABLE Students (id INTEGER, name TEXT, age INTEGER);
        CREATE TABLE Enrollments (student_id INTEGER, course TEXT);
      `,
      data: [
        { table: "Students", rows: [
          { id: 1, name: "Alice", age: 22 },
          { id: 2, name: "Bob", age: 24 },
          { id: 3, name: "Charlie", age: 23 }
        ]},
        { table: "Enrollments", rows: [
          { student_id: 1, course: "Math" },
          { student_id: 1, course: "Physics" },
          { student_id: 2, course: "Chemistry" },
          { student_id: 3, course: "Math" }
        ]}
      ],
      expectedResult: [
        { student_id: 1, "AVG(age)": 22, "COUNT(course)": 2 },
        { student_id: 2, "AVG(age)": 24, "COUNT(course)": 1 },
        { student_id: 3, "AVG(age)": 23, "COUNT(course)": 1 }
      ],
      hints: ["Use GROUP BY with student_id", "Combine COUNT and AVG functions", "Join tables first"]
    },
    rewardXP: 300
  }
];