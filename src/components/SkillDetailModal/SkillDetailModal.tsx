'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Skill } from '@/types';
import styles from './SkillDetailModal.module.css';

interface Props {
  skill: Skill | null;
  onClose: () => void;
}

export default function SkillDetailModal({ skill, onClose }: Props) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'skillmd' | 'install'>('overview');

  const fetchContent = useCallback(async () => {
    if (!skill) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/skills/content?owner=${skill.owner}&repo=${skill.repo}&path=${encodeURIComponent(skill.skillPath)}`
      );
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
      }
    } catch (err) {
      console.error('Failed to load content:', err);
    } finally {
      setLoading(false);
    }
  }, [skill]);

  useEffect(() => {
    if (skill) {
      if (skill.skillMdContent) {
        setContent(skill.skillMdContent);
      } else {
        fetchContent();
      }
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [skill, fetchContent]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!skill) return null;

  const installCmd = `npx skills add ${skill.owner}/${skill.repo}${
    skill.name.toLowerCase().replace(/\s+/g, '-') !== skill.repo
      ? ` --skill ${skill.name.toLowerCase().replace(/\s+/g, '-')}`
      : ''
  }`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.ownerInfo}>
              {skill.avatarUrl && (
                <Image src={skill.avatarUrl} alt={skill.owner} className={styles.avatar} width={32} height={32} />
              )}
              <span className={styles.ownerText}>{skill.owner}/{skill.repo}</span>
              {skill.isVerified && (
                <span className={styles.verified}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <h2 className={styles.title}>{skill.name}</h2>
            <p className={styles.desc}>{skill.description}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Stats Strip */}
        <div className={styles.statsStrip}>
          <div className={styles.statBox}>
            <span className={styles.statValue}>{skill.stars.toLocaleString()}</span>
            <span className={styles.statLabel}>Stars</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statValue}>{skill.forks.toLocaleString()}</span>
            <span className={styles.statLabel}>Forks</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statValue}>{skill.installs.toLocaleString()}</span>
            <span className={styles.statLabel}>Installs</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statValue}>{skill.agentTypes.join(', ')}</span>
            <span className={styles.statLabel}>Agent</span>
          </div>
        </div>

        {/* Install Command */}
        <div className={styles.installBar}>
          <div className={styles.installCmd}>
            <span className={styles.dollar}>$</span>
            <code>{installCmd}</code>
          </div>
          <button className={`${styles.copyBtn} ${copied ? styles.copied : ''}`} onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'skillmd' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('skillmd')}
          >
            SKILL.md
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'install' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('install')}
          >
            Installation
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.overviewContent}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Category</span>
                  <span className={styles.infoValue}>{skill.category || 'General'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Language</span>
                  <span className={styles.infoValue}>{skill.language || 'N/A'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Has Scripts</span>
                  <span className={styles.infoValue}>{skill.hasScripts ? 'Yes' : 'No'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Last Updated</span>
                  <span className={styles.infoValue}>{new Date(skill.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
              {skill.topics.length > 0 && (
                <div className={styles.topicsSection}>
                  <span className={styles.infoLabel}>Topics</span>
                  <div className={styles.topicsList}>
                    {skill.topics.map(t => (
                      <span key={t} className={styles.topicTag}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
              <a
                href={skill.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.repoLink}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub →
              </a>
            </div>
          )}

          {activeTab === 'skillmd' && (
            <div className={styles.mdContent}>
              {loading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner} />
                  <span>Loading SKILL.md...</span>
                </div>
              ) : content ? (
                <pre className={styles.rawMd}>{content}</pre>
              ) : (
                <p className={styles.noContent}>Could not load SKILL.md content.</p>
              )}
            </div>
          )}

          {activeTab === 'install' && (
            <div className={styles.installContent}>
              <h4>Quick Install</h4>
              <p>Run this command in your project root:</p>
              <div className={styles.codeBlock}>
                <code>{installCmd}</code>
              </div>
              <h4>Manual Install</h4>
              <p>Clone the skill into your agent&apos;s skills directory:</p>
              <div className={styles.codeBlock}>
                <code>{`git clone ${skill.repoUrl} /tmp/skill-source\ncp -r /tmp/skill-source/${skill.skillPath.replace('/SKILL.md', '')} .claude/skills/`}</code>
              </div>
              <h4>Supported Agents</h4>
              <div className={styles.agentList}>
                {skill.agentTypes.map(a => (
                  <div key={a} className={styles.agentItem}>
                    <span className={styles.agentDot} />
                    <span>{a === 'claude' ? 'Claude Code (.claude/skills/)' : a === 'codex' ? 'OpenAI Codex (.agents/skills/)' : a === 'gemini' ? 'Gemini CLI (.gemini/skills/)' : 'Universal'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
