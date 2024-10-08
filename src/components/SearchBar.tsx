import React from 'react';
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center bg-[#1a1f25] rounded-md shadow-dark-neumorphic-inset">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="검색"
        className="p-2 bg-transparent text-white"
      />
      <button className="p-2">
        <Search className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SearchBar;