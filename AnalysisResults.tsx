import React from 'react';

interface AnalysisResultsProps {
  results: AnalysisData | null;
  isLoading: boolean;
  summary: string | null;
  isSummarizing: boolean;
}

export interface AnalysisData {
  characterCount: number;
  wordCount: number;
  paragraphCount: number;
  longestWord: string;
  mostFrequentWords: Array<{word: string, count: number}>;
  readingTime: string;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ 
  results, 
  isLoading, 
  summary, 
  isSummarizing 
}) => {
  if (isLoading || isSummarizing) {
    return (
      <div className="w-full mt-6 p-6 bg-white rounded-lg shadow animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex flex-wrap gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-20 w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!results && !summary) return null;

  const metrics = [
    { label: 'Characters', value: results?.characterCount },
    { label: 'Words', value: results?.wordCount },
    { label: 'Paragraphs', value: results?.paragraphCount },
    { label: 'Longest Word', value: results?.longestWord },
    { label: 'Reading Time', value: results?.readingTime },
  ];

  return (
    <div className="w-full mt-6 p-6 bg-white rounded-lg shadow-md animate-fade-in">
      {results && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <div 
                key={index} 
                className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
              >
                <p className="text-sm text-gray-500">{metric.label}</p>
                <p className="text-xl font-medium text-gray-800 mt-1">{metric.value}</p>
              </div>
            ))}
          </div>

          {results.mostFrequentWords.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-700 mb-3">Most Frequent Words</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {results.mostFrequentWords.map((item, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-1 bg-white rounded-full border border-gray-200 text-sm"
                    >
                      {item.word} <span className="text-indigo-600 font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {summary && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;