import React from 'react';
import FileAnalyzer from './components/FileAnalyzer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Text & File Analyzer</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Analyze text content or upload a file to get insights about character count, word frequency, and more
        </p>
      </header>
      
      <main className="w-full max-w-3xl">
        <FileAnalyzer />
      </main>
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} File Analyzer Tool. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;