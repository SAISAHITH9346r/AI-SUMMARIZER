import React, { useState } from 'react';
import { FileText, Type } from 'lucide-react';
import FileInput from './FileInput';
import TextInput from './TextInput';
import AnalysisResults, { AnalysisData } from './AnalysisResults';

enum InputMode {
  TEXT = 'text',
  FILE = 'file'
}

const FileAnalyzer: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.TEXT);
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisData | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate delay for analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let contentToAnalyze = '';
    
    if (inputMode === InputMode.TEXT) {
      contentToAnalyze = textInput;
    } else if (selectedFile) {
      contentToAnalyze = await readFileContent(selectedFile);
    }
    
    const analysisResults = analyzeContent(contentToAnalyze);
    setResults(analysisResults);
    setIsAnalyzing(false);
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    
    let contentToSummarize = '';
    
    if (inputMode === InputMode.TEXT) {
      contentToSummarize = textInput;
    } else if (selectedFile) {
      contentToSummarize = await readFileContent(selectedFile);
    }
    
    // Simulate delay for summarization
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generatedSummary = generateSummary(contentToSummarize);
    setSummary(generatedSummary);
    setIsSummarizing(false);
  };

  const generateSummary = (text: string): string => {
    // Clean the text by removing code-like content and special characters
    const cleanedText = text
      .replace(/\(function\([^)]*\)\{[^}]*\}/g, '') // Remove function blocks
      .replace(/\[[^\]]*\]/g, '') // Remove array-like content
      .replace(/\{[^}]*\}/g, '') // Remove object-like content
      .replace(/[^\w\s.,!?]/g, ' ') // Remove special characters except basic punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Split text into sentences
    const sentences = cleanedText
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 0 && s.trim().split(/\s+/).length > 3);

    // If text is too short or no valid sentences found, return a message
    if (sentences.length === 0) {
      return "Unable to generate summary from the provided content. The text may contain too many special characters or code-like content.";
    }
    
    // Take first 3 sentences as summary
    return sentences.slice(0, 3).join('. ') + '.';
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file content'));
        }
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsText(file);
    });
  };

  const analyzeContent = (content: string): AnalysisData => {
    // Clean the content for analysis
    const cleanedContent = content
      .replace(/\(function\([^)]*\)\{[^}]*\}/g, '') // Remove function blocks
      .replace(/\[[^\]]*\]/g, '') // Remove array-like content
      .replace(/\{[^}]*\}/g, '') // Remove object-like content
      .replace(/[^\w\s]/g, ' ') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Character count (including spaces)
    const characterCount = content.length;
    
    // Word count
    const words = cleanedContent.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Paragraph count
    const paragraphCount = content.split(/\r\n\r\n|\r\r|\n\n/).filter(p => p.trim().length > 0).length || 1;
    
    // Longest word (from cleaned content)
    const longestWord = words.reduce((longest, current) => 
      current.length > longest.length ? current : longest, '');
    
    // Most frequent words
    const wordFrequency: Record<string, number> = {};
    words.forEach(word => {
      const normalizedWord = word.toLowerCase();
      if (normalizedWord.length > 2) { // Skip very short words
        wordFrequency[normalizedWord] = (wordFrequency[normalizedWord] || 0) + 1;
      }
    });
    
    const mostFrequentWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({ word, count }));
    
    // Reading time calculation (average reading speed: 200 words per minute)
    const readingTimeMinutes = wordCount / 200;
    const readingTime = readingTimeMinutes < 1 
      ? `${Math.ceil(readingTimeMinutes * 60)} seconds` 
      : `${Math.ceil(readingTimeMinutes)} minutes`;
    
    return {
      characterCount,
      wordCount,
      paragraphCount,
      longestWord,
      mostFrequentWords,
      readingTime
    };
  };

  const isAnalyzeDisabled = (inputMode === InputMode.TEXT && textInput.trim() === '') || 
                            (inputMode === InputMode.FILE && !selectedFile);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">File Analyzer</h1>
        
        {/* Input Type Selector */}
        <div className="flex space-x-2 mb-4">
          <button
            type="button"
            onClick={() => setInputMode(InputMode.TEXT)}
            className={`
              flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${inputMode === InputMode.TEXT 
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                : 'text-gray-600 hover:bg-gray-100 border border-transparent'}
            `}
          >
            <Type className="w-4 h-4 mr-2" />
            Text Input
          </button>
          <button
            type="button"
            onClick={() => setInputMode(InputMode.FILE)}
            className={`
              flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${inputMode === InputMode.FILE 
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                : 'text-gray-600 hover:bg-gray-100 border border-transparent'}
            `}
          >
            <FileText className="w-4 h-4 mr-2" />
            File Upload
          </button>
        </div>

        {/* Input Section */}
        <div className="mb-6">
          {inputMode === InputMode.TEXT ? (
            <TextInput value={textInput} onChange={setTextInput} />
          ) : (
            <FileInput onFileSelect={setSelectedFile} selectedFile={selectedFile} />
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzeDisabled || isAnalyzing}
            className={`
              px-6 py-3 rounded-md text-white font-medium transition-all
              ${isAnalyzeDisabled || isAnalyzing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg active:scale-[0.98]'}
            `}
          >
            {isAnalyzing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyse'
            )}
          </button>

          <button
            type="button"
            onClick={handleSummarize}
            disabled={isAnalyzeDisabled || isSummarizing}
            className={`
              px-6 py-3 rounded-md text-white font-medium transition-all
              ${isAnalyzeDisabled || isSummarizing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg active:scale-[0.98]'}
            `}
          >
            {isSummarizing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Summarizing...
              </span>
            ) : (
              'Summarize'
            )}
          </button>
        </div>
      </div>
      
      {/* Results Section */}
      <AnalysisResults results={results} isLoading={isAnalyzing} summary={summary} isSummarizing={isSummarizing} />
    </div>
  );
};

export default FileAnalyzer;