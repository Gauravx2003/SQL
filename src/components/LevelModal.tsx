import React, { useState } from 'react';
import { X, Play, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { Level } from '../data/levels';
import { useSQL } from '../hooks/useSQL';

interface LevelModalProps {
  level: Level;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (xpGained: number) => void;
}

export const LevelModal: React.FC<LevelModalProps> = ({ 
  level, 
  isOpen, 
  onClose, 
  onComplete 
}) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [showHints, setShowHints] = useState(false);
  const { executeQuery, isReady } = useSQL();

  const handleRunQuery = () => {
    if (!query.trim()) {
      setResult({ success: false, error: 'Please enter a SQL query' });
      return;
    }

    try {
      const queryResult = executeQuery(level.problem.schema, level.problem.data, query);
      
      if (queryResult.success) {
        // Check if result matches expected (simplified comparison)
        const isCorrect = level.problem.expectedResult 
          ? JSON.stringify(queryResult.data) === JSON.stringify(level.problem.expectedResult)
          : queryResult.data.length > 0;
        
        setResult({
          success: true,
          data: queryResult.data,
          columns: queryResult.columns,
          isCorrect
        });

        if (isCorrect) {
          setTimeout(() => {
            onComplete(level.rewardXP);
            onClose();
          }, 2000);
        }
      } else {
        setResult(queryResult);
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    }
  };

  const renderTableData = (data: any[]) => {
    if (!Array.isArray(data) || data.length === 0) return null;

    // Handle multiple table data structure
    if (data[0]?.table) {
      return (
        <div className="space-y-4">
          {data.map((tableData, index) => (
            <div key={index}>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                {tableData.table} Table:
              </h4>
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-700">
                    <tr>
                      {Object.keys(tableData.rows[0] || {}).map((key) => (
                        <th key={key} className="px-3 py-2 text-left text-gray-300">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.rows.map((row: any, rowIndex: number) => (
                      <tr key={rowIndex} className="border-t border-gray-700">
                        {Object.values(row).map((value: any, cellIndex) => (
                          <td key={cellIndex} className="px-3 py-2 text-gray-200">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Handle single table data
    const keys = Object.keys(data[0]);
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-700">
            <tr>
              {keys.map((key) => (
                <th key={key} className="px-3 py-2 text-left text-gray-300">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-t border-gray-700">
                {keys.map((key) => (
                  <td key={key} className="px-3 py-2 text-gray-200">
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">{level.name}</h2>
            <p className="text-gray-400">{level.environment} • +{level.rewardXP} XP</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Left Panel - Problem & Data */}
          <div className="w-1/2 p-6 border-r border-gray-700 overflow-y-auto">
            <div className="space-y-6">
              {/* Challenge */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Challenge</h3>
                <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">
                  {level.problem.question}
                </p>
              </div>

              {/* Schema */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Database Schema</h3>
                <pre className="bg-gray-800 p-4 rounded-lg text-sm text-green-400 overflow-x-auto">
                  {level.problem.schema}
                </pre>
              </div>

              {/* Sample Data */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Sample Data</h3>
                {renderTableData(level.problem.data)}
              </div>

              {/* Hints */}
              <div>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <Lightbulb size={16} />
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </button>
                
                {showHints && level.problem.hints && (
                  <div className="mt-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <ul className="space-y-1 text-sm text-yellow-200">
                      {level.problem.hints.map((hint, index) => (
                        <li key={index}>• {hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Query Editor & Results */}
          <div className="w-1/2 p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-3">Your SQL Query</h3>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SELECT * FROM..."
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white font-mono text-sm resize-none focus:outline-none focus:border-blue-500"
              />
              
              <button
                onClick={handleRunQuery}
                disabled={!isReady || !query.trim()}
                className="mt-3 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Play size={16} />
                Run Query
              </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto">
              {result && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Results</h3>
                  
                  {result.success ? (
                    <div>
                      {result.isCorrect !== undefined && (
                        <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
                          result.isCorrect 
                            ? 'bg-green-900/30 border border-green-500/30 text-green-400' 
                            : 'bg-red-900/30 border border-red-500/30 text-red-400'
                        }`}>
                          {result.isCorrect ? (
                            <>
                              <CheckCircle size={20} />
                              <span>Perfect! Challenge completed! +{level.rewardXP} XP</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle size={20} />
                              <span>Not quite right. Check the expected output and try again.</span>
                            </>
                          )}
                        </div>
                      )}
                      
                      {result.data.length > 0 ? (
                        renderTableData(result.data)
                      ) : (
                        <p className="text-gray-400">Query executed successfully but returned no results.</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-red-400 mb-2">
                        <AlertCircle size={20} />
                        <span className="font-semibold">Error</span>
                      </div>
                      <p className="text-red-300 text-sm">{result.error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};