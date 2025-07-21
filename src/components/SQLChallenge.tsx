import React, { useState } from 'react';
import { X, Play, CheckCircle, AlertCircle, Lightbulb, Trophy } from 'lucide-react';
import { GameLevel } from '../data/gameData';
import { useSQL } from '../hooks/useSQL';

interface SQLChallengeProps {
  level: GameLevel;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (levelId: number, xpGained: number) => void;
}

export const SQLChallenge: React.FC<SQLChallengeProps> = ({
  level,
  isOpen,
  onClose,
  onComplete
}) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [showHints, setShowHints] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const { executeQuery, isReady } = useSQL();

  const handleRunQuery = () => {
    if (!query.trim()) {
      setResult({ success: false, error: 'Please enter a SQL query' });
      return;
    }

    try {
      const queryResult = executeQuery(
        level.challenge.schema,
        level.challenge.sampleData,
        query
      );

      if (queryResult.success) {
        // Check if result matches expected output
        const isCorrect = JSON.stringify(queryResult.data) === 
                         JSON.stringify(level.challenge.expectedResult);

        setResult({
          success: true,
          data: queryResult.data,
          columns: queryResult.columns,
          isCorrect
        });

        if (isCorrect) {
          setIsCompleting(true);
          setTimeout(() => {
            onComplete(level.id, level.challenge.rewardXP);
            onClose();
            setIsCompleting(false);
            setQuery('');
            setResult(null);
          }, 2500);
        }
      } else {
        setResult(queryResult);
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    }
  };

  const renderTable = (data: any[]) => {
    if (!data || data.length === 0) return null;

    const columns = Object.keys(data[0]);
    
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-700">
            <tr>
              {columns.map(col => (
                <th key={col} className="px-4 py-2 text-left text-gray-300 font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-t border-gray-700 hover:bg-gray-750">
                {columns.map(col => (
                  <td key={col} className="px-4 py-2 text-gray-200">
                    {row[col]}
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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white">{level.challenge.title}</h2>
            <p className="text-blue-300 mt-1">{level.name} • Reward: +{level.challenge.rewardXP} XP</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex h-[calc(90vh-100px)]">
          {/* Left Panel - Challenge Info */}
          <div className="w-1/2 p-6 border-r border-gray-700 overflow-y-auto">
            <div className="space-y-6">
              {/* Challenge Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Trophy className="text-yellow-500" size={20} />
                  Challenge
                </h3>
                <p className="text-gray-300 bg-gray-800 p-4 rounded-lg border border-gray-700">
                  {level.challenge.description}
                </p>
              </div>

              {/* Database Schema */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Database Schema</h3>
                <pre className="bg-gray-800 p-4 rounded-lg text-sm text-green-400 overflow-x-auto border border-gray-700 font-mono">
                  {level.challenge.schema}
                </pre>
              </div>

              {/* Sample Data */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Sample Data</h3>
                {renderTable(level.challenge.sampleData)}
              </div>

              {/* Expected Output */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Expected Output</h3>
                {renderTable(level.challenge.expectedResult)}
              </div>

              {/* Hints */}
              <div>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors mb-3"
                >
                  <Lightbulb size={16} />
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </button>
                
                {showHints && (
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <ul className="space-y-2 text-sm text-yellow-200">
                      {level.challenge.hints.map((hint, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          <span>{hint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - SQL Editor & Results */}
          <div className="w-1/2 p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-3">Your SQL Query</h3>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SELECT * FROM students;"
                className="w-full h-40 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white font-mono text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={isCompleting}
              />
              
              <button
                onClick={handleRunQuery}
                disabled={!isReady || !query.trim() || isCompleting}
                className="mt-3 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                <Play size={16} />
                {isCompleting ? 'Completing...' : 'Run Query'}
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
                        <div className={`flex items-center gap-3 p-4 rounded-lg mb-4 ${
                          result.isCorrect 
                            ? 'bg-green-900/30 border border-green-500/30 text-green-400' 
                            : 'bg-red-900/30 border border-red-500/30 text-red-400'
                        }`}>
                          {result.isCorrect ? (
                            <>
                              <CheckCircle size={24} />
                              <div>
                                <div className="font-semibold">Perfect! Challenge completed!</div>
                                <div className="text-sm opacity-90">+{level.challenge.rewardXP} XP earned</div>
                              </div>
                            </>
                          ) : (
                            <>
                              <AlertCircle size={24} />
                              <div>
                                <div className="font-semibold">Not quite right</div>
                                <div className="text-sm opacity-90">Compare your result with the expected output</div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                      
                      {result.data.length > 0 ? (
                        renderTable(result.data)
                      ) : (
                        <p className="text-gray-400 bg-gray-800 p-4 rounded-lg border border-gray-700">
                          Query executed successfully but returned no results.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-red-400 mb-2">
                        <AlertCircle size={20} />
                        <span className="font-semibold">SQL Error</span>
                      </div>
                      <p className="text-red-300 text-sm font-mono">{result.error}</p>
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