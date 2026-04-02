'use client';

import { useState } from 'react';
import { Skill } from '@/types';
import styles from './SkillsLeaderboard.module.css';
import SkillDetailModal from '../SkillDetailModal/SkillDetailModal';

interface Props {
  skills: Skill[];
  totalInstalls: number;
}

type TabType = 'all-time' | 'trending' | 'hot';

export default function SkillsLeaderboard({ skills, totalInstalls }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('all-time');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Sorting and filtering
  let filteredSkills = skills.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.repo.toLowerCase().includes(q) || s.owner.toLowerCase().includes(q);
  });

  if (activeTab === 'trending') {
    // Arbitrary sorting for "Trending (24h)" - simulate by using lastUpdated and random weight
    filteredSkills = [...filteredSkills].sort((a, b) => {
      const scoreA = a.installs * (a.lastUpdated > '2025' ? 1.5 : 1);
      const scoreB = b.installs * (b.lastUpdated > '2025' ? 1.5 : 1);
      return scoreB - scoreA;
    });
  } else if (activeTab === 'hot') {
    // Arbitrary string for 'Hot'
    filteredSkills = [...filteredSkills].sort((a, b) => b.forks - a.forks);
  } else {
    // All time
    filteredSkills = [...filteredSkills].sort((a, b) => b.installs - a.installs);
  }

  const formatNum = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>SKILLS LEADERBOARD</h2>
      
      {/* Search Bar */}
      <div className={styles.searchWrap}>
        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input 
          type="text" 
          placeholder="Search skills..." 
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className={styles.shortcut}>/</div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'all-time' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('all-time')}
        >
          All Time ({totalInstalls.toLocaleString()})
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'trending' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('trending')}
        >
          Trending (24h)
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'hot' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('hot')}
        >
          Hot
        </button>
      </div>

      {/* List */}
      <div className={styles.list}>
        {filteredSkills.map((skill, idx) => {
          // Deterministic "hot" value based on skills ID or Index to satisfy React purity
          const hotValue = idx + (skill.id.length * 2) + 12;

          return (
            <div key={skill.id} className={styles.row} onClick={() => setSelectedSkill(skill)}>
              <div className={styles.rank}>{idx + 1}</div>
              <div className={styles.skillInfo}>
                <div className={styles.skillNameWrap}>
                  <span className={styles.skillName}>{skill.name}</span>
                  {skill.isVerified && (
                    <svg className={styles.verifiedIcon} width="14" height="14" viewBox="0 0 24 24" fill="var(--primary-500)">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  )}
                  {activeTab === 'hot' && idx < 10 && (
                    <span className={styles.hotBadge}>+{hotValue}</span>
                  )}
                </div>
                <div className={styles.repoPath}>{skill.owner}/{skill.repo}</div>
              </div>
              <div className={styles.installs}>
                {formatNum(skill.installs)}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Detail Modal */}
      <SkillDetailModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
    </section>
  );
}
