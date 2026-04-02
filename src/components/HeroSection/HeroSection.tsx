'use client';

import { useState } from 'react';
import styles from './HeroSection.module.css';

interface Props {
  totalInstalls: number;
}

export default function HeroSection({ totalInstalls }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('npx skills add <owner/repo>');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  const formatNum = (n: number) => n.toLocaleString();

  return (
    <section className={styles.hero}>
      <div className={styles.heroGlow} />

      {/* ASCII-style Logo */}
      <div className={styles.logoBlock}>
        <div className={styles.asciiLogo}>
          <span className={styles.logoChar}>S</span>
          <span className={styles.logoChar}>K</span>
          <span className={styles.logoChar}>I</span>
          <span className={styles.logoChar}>L</span>
          <span className={styles.logoChar}>L</span>
          <span className={styles.logoChar}>S</span>
        </div>
        <p className={styles.tagline}>THE OPEN AGENT SKILLS ECOSYSTEM</p>
      </div>

      <p className={styles.description}>
        Skills are reusable capabilities for AI agents. Install them with a single command to enhance your agents with access to procedural knowledge.
      </p>

      {/* Try it now */}
      <div className={styles.trySection}>
        <h2 className={styles.tryTitle}>TRY IT NOW</h2>
        <div className={styles.terminalBox} onClick={handleCopy}>
          <span className={styles.dollar}>$</span>
          <code className={styles.cmd}>npx skills add <span className={styles.placeholder}>&lt;owner/repo&gt;</span></code>
          <button className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}>
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Live Badge */}
      <div className={styles.liveBadge}>
        <span className={styles.liveDot} />
        <span>{formatNum(totalInstalls)} total installs across the ecosystem</span>
      </div>
    </section>
  );
}
