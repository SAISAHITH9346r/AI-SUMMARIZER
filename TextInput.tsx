import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Paste your text here for analysis..." 
}) => {
  return (
    <div className="w-full mt-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-64 p-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200 outline-none"
        spellCheck={false}
      />
      <div className="flex justify-end mt-2">
        <p className="text-xs text-gray-500">
          {value.length} characters
        </p>
      </div>
    </div>
  );
};

export default TextInput;