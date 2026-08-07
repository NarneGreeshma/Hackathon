import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const active = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all duration-200 ${
              active
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30'
                : 'bg-gray-900/80 text-gray-400 border border-gray-800 hover:border-gray-700 hover:text-white'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
