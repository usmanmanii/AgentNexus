'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Skill } from '@/types';
import styles from './SkillCard.module.css';

interface Props {
  skill: Skill;
  index: number;
  onViewDetail?: (skill: Skill) => void;
}

const agentBadgeColors: Record<string, { bg: string; color: string }> = {
  claude: { bg: '#fef3c7', color: '#92400e' },
  codex: { bg: '#dbeafe', color: '#1e40af' },
  gemini: { bg: '#dcfce7', color: '#166534' },
  universal: { bg: '#f3e8ff', color: '#6b21a8' },
};

export default function SkillCard({ skill, index, onViewDetail }: Props) {
  const [copied, setCopied] = useState(false);

  const installCmd = `npx skills add ${skill.owner}/${skill.repo}${
    skill.name.toLowerCase().replace(/\s+/g, '-') !== skill.repo
      ? ` --skill ${skill.name.toLowerCase().replace(/\s+/g, '-')}`
      : ''
  }`;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(installCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const timeSince = (dateStr: string): string => {
    const d = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 2592000)}mo ago`;
  };

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => onViewDetail?.(skill)}
    >
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.ownerInfo}>
          {skill.avatarUrl && (
            <Image src={skill.avatarUrl} alt={skill.owner} className={styles.avatar} width={24} height={24} />
          )}
          <span className={styles.ownerName}>{skill.owner}</span>
          {skill.isVerified && (
            <span className={styles.verifiedBadge} title="Verified">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
          )}
        </div>
        <div className={styles.agentBadges}>
          {skill.agentTypes.map(agent => (
            <span
              key={agent}
              className={styles.agentBadge}
              style={{
                background: agentBadgeColors[agent]?.bg || '#f3f4f6',
                color: agentBadgeColors[agent]?.color || '#374151',
              }}
            >
              {agent}
            </span>
          ))}
        </div>
      </div>

      {/* Card Body */}
      <div className={styles.cardBody}>
        <h3 className={styles.skillName}>{skill.name}</h3>
        <p className={styles.description}>{skill.description}</p>
      </div>

      {/* Category Tag */}
      {skill.category && (
        <div className={styles.categoryRow}>
          <span className={styles.categoryTag}>{skill.category}</span>
          {skill.language && <span className={styles.langTag}>{skill.language}</span>}
        </div>
      )}

      {/* Install Command */}
      <div className={styles.installSection}>
        <div className={styles.installCmd}>
          <span className={styles.dollar}>$</span>
          <code className={styles.cmdText}>{installCmd}</code>
        </div>
        <button
          className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ''}`}
          onClick={handleCopy}
          title="Copy install command"
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          )}
        </button>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>{skill.stars.toLocaleString()}</span>
        </div>
        <div className={styles.stat}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="18" r="3"/>
            <circle cx="6" cy="6" r="3"/>
            <circle cx="18" cy="6" r="3"/>
            <path d="M18 9a9 9 0 0 1-9 9"/>
            <path d="M6 9a9 9 0 0 0 9 9"/>
          </svg>
          <span>{skill.forks.toLocaleString()}</span>
        </div>
        <div className={styles.stat}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>{skill.installs.toLocaleString()}</span>
        </div>
        <div className={styles.statTime}>
          {timeSince(skill.lastUpdated)}
        </div>
      </div>

      {/* View Arrow */}
      <div className={styles.viewArrow}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </div>
  );
}
