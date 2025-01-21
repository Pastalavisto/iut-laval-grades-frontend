import React, { useEffect, useState } from 'react';

interface FilterBarProps {
  suggestions: ValueProps[];
  onChange: (value: number) => void;
  defaultValue?: string;
}

interface ValueProps {
  value: string;
  id: number;
}

export default function FilterBar({ suggestions, onChange, defaultValue }: FilterBarProps) {
  const [filteredSuggestions, setFilteredSuggestions] = useState<ValueProps[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [value, setValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);

    if (value.trim() === '') {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const matches = suggestions.filter((suggestion) => suggestion.value.toLowerCase().includes(value.toLowerCase()));

    setFilteredSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  };

  const handleSuggestionClick = (suggestion: ValueProps) => {
    setShowSuggestions(false);
    onChange(suggestion.id);
  };

  useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue]);
  return (
    <div className="mb-4 w-full z-10 relative">
      <input
        type="text"
        className="w-full p-2 rounded border-gray-300 focus:outline-none focus:border-blue-500 border-2"
        value={value || ""}
        onChange={handleInputChange}
        placeholder="Tapez un mot clé..."
        onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      {showSuggestions && (
        <ul className="w-full border-1 p2 bg-white shadow-md">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {suggestion.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
