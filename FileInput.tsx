import React, { useState, useRef } from 'react';
import { FileUp, X } from 'lucide-react';

interface FileInputProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const FileInput: React.FC<FileInputProps> = ({ onFileSelect, selectedFile }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      setError('Please upload a .txt file only');
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      } else {
        onFileSelect(null);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      } else {
        onFileSelect(null);
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`
          relative
          flex flex-col items-center justify-center
          w-full p-6 mt-4
          border-2 border-dashed rounded-lg
          transition-all duration-300 ease-in-out
          cursor-pointer
          ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'}
          ${selectedFile ? 'bg-gray-50' : ''}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={inputRef}
          type="file" 
          className="hidden"
          onChange={handleChange}
          accept=".txt,text/plain"
        />
        
        {selectedFile ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <FileUp className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
            <button 
              type="button"
              onClick={clearFile}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <FileUp className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-700">
              <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              Any file type supported
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileInput;