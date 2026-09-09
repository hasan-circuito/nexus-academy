// components/dictionary/CategoryFilterPills.tsx
// NEXUS Academy — Category Filter Pill Bar
'use client';

import React from 'react';
import { Bookmark } from 'lucide-react';

interface CategoryItem {
  id: string;
  label: string;
}

interface CategoryFilterPillsProps {
  categories: readonly CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  bookmarkCount?: number;
}

export const CategoryFilterPills: React.FC<CategoryFilterPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  bookmarkCount = 0,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 no-scrollbar">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const isBookmark = cat.id === 'bookmarked';

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer border ${
              isSelected
                ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105'
                : 'bg-card/80 hover:bg-card text-muted-foreground hover:text-foreground border-border hover:border-primary/40'
            }`}
          >
            {isBookmark && (
              <Bookmark
                className={`w-3.5 h-3.5 ${
                  isSelected ? 'fill-primary-foreground text-primary-foreground' : 'text-amber-400'
                }`}
              />
            )}
            <span>{cat.label}</span>
            {isBookmark && bookmarkCount > 0 && (
              <span
                className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected
                    ? 'bg-primary-foreground text-primary'
                    : 'bg-primary/20 text-primary'
                }`}
              >
                {bookmarkCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
