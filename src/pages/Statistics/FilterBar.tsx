import React, { useState } from 'react';

interface FilterBarProps {
  suggestions: string[];
  onFilterChange: (newFilters: { [key: string]: string }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ suggestions, onFilterChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const matches = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    onFilterChange({ search: suggestion });
  };

  const styles = {
    filterBar: {
      position: 'relative' as const,
      width: '100%',
      margin: '0 auto',
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    suggestionsList: {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      listStyleType: 'none',
      margin: 0,
      padding: 0,
      maxHeight: '200px',
      overflowY: 'auto' as const,
    },
    suggestionItem: {
      padding: '10px',
      cursor: 'pointer',
      borderBottom: '1px solid #eee',
    },
    suggestionItemHover: {
      backgroundColor: '#f5f5f5',
    },
  };

  return (
    <div style={styles.filterBar}>
      <input
        type="text"
        style={styles.input}
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Tapez un mot clé..."
        onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      {showSuggestions && (
        <ul style={styles.suggestionsList}>
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              style={styles.suggestionItem}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = styles.suggestionItemHover.backgroundColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { FilterBar };
