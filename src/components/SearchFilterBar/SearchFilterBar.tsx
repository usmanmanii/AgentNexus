'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './SearchFilterBar.module.css';
import { AgentType } from '@/types';

interface Props {
  onSearch: (query: string) => void;
  onFilterAgent: (agent: AgentType | 'all') => void;
  onFilterCategory: (category: string | 'all') => void;
  onSortChange: (sort: 'stars' | 'installs' | 'updated' | 'name') => void;
  activeAgent: AgentType | 'all';
  activeCategory: string | 'all';
  activeSort: 'stars' | 'installs' | 'updated' | 'name';
  activeSearch: string;
  categories: string[];
  resultCount: number;
}

const agentFilters: { value: AgentType | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All Agents', icon: '⚡' },
  { value: 'claude', label: 'Claude', icon: '🟠' },
  { value: 'codex', label: 'Codex', icon: '🔵' },
  { value: 'gemini', label: 'Gemini', icon: '🟢' },
  { value: 'universal', label: 'Universal', icon: '🟣' },
];

export default function SearchFilterBar({
  onSearch,
  onFilterAgent,
  onFilterCategory,
  onSortChange,
  activeAgent,
  activeCategory,
  activeSort,
  activeSearch,
  categories,
  resultCount,
}: Props) {
  const [searchValue, setSearchValue] = useState(activeSearch);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Sync internal state with prop
  useEffect(() => {
    setSearchValue(activeSearch);
  }, [activeSearch]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleChange = (val: string) => {
    setSearchValue(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(val);
    }, 300);
  };

  return (
    <div className={styles.container}>
      {/* Search Input */}
      <div className={`${styles.searchWrapper} ${isFocused ? styles.searchFocused : ''}`}>
        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          className={styles.searchInput}
          type="text"
          placeholder="Search skills, agents, frameworks..."
          value={searchValue}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {searchValue && (
          <button className={styles.clearBtn} onClick={() => handleChange('')} aria-label="Clear search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        <div className={styles.shortcutHint}>
          <kbd>⌘</kbd><kbd>K</kbd>
        </div>
      </div>

      {/* Filter Row */}
      <div className={styles.filterRow}>
        {/* Agent Filter */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Agent</span>
          <div className={styles.pillGroup}>
            {agentFilters.map(af => (
              <button
                key={af.value}
                className={`${styles.pill} ${activeAgent === af.value ? styles.pillActive : ''}`}
                onClick={() => onFilterAgent(af.value)}
              >
                <span className={styles.pillIcon}>{af.icon}</span>
                {af.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Category</span>
          <select
            className={styles.selectFilter}
            value={activeCategory}
            onChange={e => onFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Sort</span>
          <select
            className={styles.selectFilter}
            value={activeSort}
            onChange={e => onSortChange(e.target.value as 'stars' | 'installs' | 'updated' | 'name')}
          >
            <option value="stars">Most Stars</option>
            <option value="installs">Most Installs</option>
            <option value="updated">Recently Updated</option>
            <option value="name">Name A→Z</option>
          </select>
        </div>

        {/* Result Count */}
        <div className={styles.resultCount}>
          <span className={styles.countNum}>{resultCount}</span> skills found
        </div>
      </div>
    </div>
  );
}
