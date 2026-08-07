import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: string;
  onSortChange: (s: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search AI agents by name, category, or tag..."
          className="w-full rounded-xl border border-gray-800 bg-gray-900/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 font-sans backdrop-blur-md transition-all"
        />
      </div>

      {/* Sort By Dropdown */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <ArrowUpDown className="h-4 w-4 text-gray-400 shrink-0" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-xl border border-gray-800 bg-gray-900/80 px-3 py-2.5 text-xs font-mono text-gray-300 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 backdrop-blur-md cursor-pointer"
        >
          <option value="trending">Trending Agents</option>
          <option value="top-rated">Top Rated</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest Agents</option>
        </select>
      </div>
    </div>
  );
};
