// components/dictionary/DictionaryHeader.tsx
// NEXUS Academy — Dictionary Header with English Search & Symptom Suggestion Pills
'use client';

import React from 'react';
import { Search, X, Sparkles, HelpCircle } from 'lucide-react';

interface DictionaryHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalResults: number;
}

const QUICK_SUGGESTIONS = [
  { label: 'TypeError', query: 'TypeError' },
  { label: 'SyntaxError', query: 'SyntaxError' },
  { label: 'NameError', query: 'NameError' },
  { label: 'numbers joining', query: 'numbers joining' },
  { label: 'missing quotes', query: 'quotes' },
  { label: 'input() conversion', query: 'user_input' },
  { label: 'f-strings', query: 'f_strings' },
  { label: 'zero division', query: 'zero_division' },
];

export const DictionaryHeader: React.FC<DictionaryHeaderProps> = ({
  searchQuery,
  onSearchChange,
  totalResults,
}) => {
  return (
    <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
        <Sparkles className="w-3.5 h-3.5" />
        <span>প্রবলেম সলভিং ও কনসেপ্ট হাব</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-foreground font-bangla-ui tracking-tight">
        NEXUS ডিকশনারি ও ফিক্স প্যাটার্ন হাব
      </h1>
      <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto font-bangla">
        কোডে কোনো এরর বা সমস্যায় আটকে গেছো? লক্ষণ (Symptom), এরর নাম বা কি-ওয়ার্ড দিয়ে সার্চ করে কনসেপ্টের গভীরে যাও এবং রিয়েল-ওয়ার্ল্ড ফিক্স প্যাটার্ন দেখো।
      </p>

      {/* Search Input Box */}
      <div className="relative mt-6 group max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-13 pl-12 pr-10 rounded-2xl border border-border bg-surface/60 text-foreground shadow-lg placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary text-base transition-all font-sans"
          placeholder="Search by symptom, error, or concept (e.g. TypeError, quotes, joining)..."
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-3 flex items-center pr-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Quick Suggestion Pills */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 max-w-2xl mx-auto">
        <span className="text-xs text-muted-foreground flex items-center gap-1 mr-1">
          <HelpCircle className="w-3.5 h-3.5" /> জনপ্রিয় সার্চ:
        </span>
        {QUICK_SUGGESTIONS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onSearchChange(item.query)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
              searchQuery.toLowerCase() === item.query.toLowerCase()
                ? 'bg-primary text-primary-foreground border-primary font-medium shadow-sm'
                : 'bg-card/70 hover:bg-card border-border hover:border-primary/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
};
