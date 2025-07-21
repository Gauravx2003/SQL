import { useState, useEffect } from 'react';

let SQL: any = null;

export const useSQL = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initSQL = async () => {
      try {
        const sqlJS = await import('sql.js');
        const wasmUrl = 'https://sql.js.org/dist/sql-wasm.wasm';
        SQL = await sqlJS.default({
          locateFile: () => wasmUrl
        });
        setIsReady(true);
      } catch (err) {
        setError('Failed to initialize SQL engine');
        console.error(err);
      }
    };

    if (!SQL) {
      initSQL();
    } else {
      setIsReady(true);
    }
  }, []);

  const executeQuery = (schema: string, data: any[], query: string) => {
    if (!SQL || !isReady) {
      throw new Error('SQL engine not ready');
    }

    try {
      const db = new SQL.Database();
      
      // Execute schema
      db.exec(schema);
      
      // Insert data
      if (Array.isArray(data) && data.length > 0) {
        // Handle single table data
        if (!data[0].table) {
          const tableName = schema.match(/CREATE TABLE (\w+)/)?.[1] || 'Students';
          const keys = Object.keys(data[0]);
          const insertSQL = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES ${
            data.map(row => `(${keys.map(key => 
              typeof row[key] === 'string' ? `'${row[key]}'` : row[key]
            ).join(', ')})`).join(', ')
          };`;
          db.exec(insertSQL);
        } else {
          // Handle multiple table data
          data.forEach(tableData => {
            const { table, rows } = tableData;
            if (rows.length > 0) {
              const keys = Object.keys(rows[0]);
              const insertSQL = `INSERT INTO ${table} (${keys.join(', ')}) VALUES ${
                rows.map(row => `(${keys.map(key => 
                  typeof row[key] === 'string' ? `'${row[key]}'` : row[key]
                ).join(', ')})`).join(', ')
              };`;
              db.exec(insertSQL);
            }
          });
        }
      }
      
      // Execute user query
      const result = db.exec(query);
      db.close();
      
      if (result.length === 0) {
        return { success: true, data: [], columns: [] };
      }
      
      const { columns, values } = result[0];
      const data_result = values.map(row => 
        columns.reduce((obj, col, index) => ({
          ...obj,
          [col]: row[index]
        }), {})
      );
      
      return { success: true, data: data_result, columns };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { executeQuery, isReady, error };
};