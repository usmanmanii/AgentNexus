'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Skill, AgentType, StatsOverview } from '@/types';
import Header from '@/components/Header/Header';
import SearchFilterBar from '@/components/SearchFilterBar/SearchFilterBar';
import SkillCard from '@/components/SkillCard/SkillCard';
import SkillDetailModal from '@/components/SkillDetailModal/SkillDetailModal';
import HeroSection from '@/components/HeroSection/HeroSection';
import SkillsLeaderboard from '@/components/SkillsLeaderboard/SkillsLeaderboard';
import StatsBar from '@/components/StatsBar/StatsBar';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';

export default function Home() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAgent, setActiveAgent] = useState<AgentType | 'all'>('all');
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [activeSort, setActiveSort] = useState<'stars' | 'installs' | 'updated' | 'name'>('stars');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [page, setPage] = useState(1);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeAgent, activeCategory]);

  // Fetch skills from API
  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (activeAgent !== 'all') params.set('agent', activeAgent);
      if (activeCategory !== 'all') params.set('category', activeCategory);
      if (activeSort !== 'stars') params.set('sort', activeSort);
      params.set('page', page.toString());
      params.set('source', 'all');

      const res = await fetch(`/api/skills?${params}`);
      const data = await res.json();
      setSkills(data.skills || []);
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeAgent, activeCategory, activeSort, page]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchSkills, 300000);
    return () => clearInterval(interval);
  }, [fetchSkills]);

  // Derived filtered results (API handles filtering, so we just use the fetched skills)
  const filteredSkills = useMemo(() => {
    return skills;
  }, [skills]);

  // Categories from loaded skills (Ideally would come from a separate API to be stable)
  const categories = useMemo(() => {
    const cats = new Set(skills.map(s => s.category).filter(Boolean) as string[]);
    return Array.from(cats).sort();
  }, [skills]);

  // Stats
  const stats: StatsOverview = useMemo(() => {
    const repos = new Set(skills.map(s => `${s.owner}/${s.repo}`));
    const agents = new Set(skills.flatMap(s => s.agentTypes));
    return {
      totalSkills: skills.length,
      totalAgents: agents.size || 4,
      totalInstalls: skills.reduce((sum, s) => sum + s.installs, 0),
      totalRepos: repos.size,
    };
  }, [skills]);

  return (
    <>
      <Header />

      <main className={styles.main}>
        {/* Hero Section */}
        <HeroSection totalInstalls={stats.totalInstalls} />

        {/* Stats */}
        <section className={styles.statsSection}>
          <StatsBar stats={stats} loading={loading} />
        </section>

        {/* Skills Grid */}
        <section id="skills" className={styles.skillsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Skills Directory
            </h2>
            <button className={styles.refreshBtn} onClick={fetchSkills} disabled={loading}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={loading ? styles.spinning : ''}>
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              {loading ? 'Syncing...' : 'Refresh'}
            </button>
          </div>

          <SearchFilterBar
            onSearch={setSearchQuery}
            onFilterAgent={setActiveAgent}
            onFilterCategory={setActiveCategory}
            onSortChange={setActiveSort}
            activeAgent={activeAgent}
            activeCategory={activeCategory}
            activeSort={activeSort}
            activeSearch={searchQuery}
            categories={categories}
            resultCount={filteredSkills.length}
          />

          {loading ? (
            <div className={styles.skeletonGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={styles.skeletonLine} style={{ width: '40%' }} />
                  <div className={styles.skeletonLine} style={{ width: '70%', height: '20px' }} />
                  <div className={styles.skeletonLine} style={{ width: '100%' }} />
                  <div className={styles.skeletonLine} style={{ width: '90%' }} />
                  <div className={styles.skeletonLine} style={{ width: '100%', height: '44px' }} />
                  <div className={styles.skeletonLine} style={{ width: '60%' }} />
                </div>
              ))}
            </div>
          ) : filteredSkills.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <h3>No skills found</h3>
              <p>Try adjusting your search or filter criteria. Skills are dynamically fetched from GitHub.</p>
              <button className={styles.resetBtn} onClick={() => {
                setSearchQuery('');
                setActiveAgent('all');
                setActiveCategory('all');
              }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {filteredSkills.map((skill, i) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    index={i}
                    onViewDetail={setSelectedSkill}
                  />
                ))}
              </div>

              {/* Pagination */}
              {filteredSkills.length >= 20 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.pageBtn}
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    ← Previous
                  </button>
                  <span className={styles.pageInfo}>Page {page}</span>
                  <button
                    className={styles.pageBtn}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Skills Leaderboard */}
        {!loading && skills.length > 0 && (
          <SkillsLeaderboard skills={skills} totalInstalls={stats.totalInstalls} />
        )}

        {/* Agent Comparison Section */}
        <section className={styles.comparisonSection}>
          <h2 className={styles.sectionTitle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
              <rect x="9" y="9" width="6" height="6"/>
            </svg>
            Agent Configuration Comparison
          </h2>
          <div className={styles.compTable}>
            <table>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Claude Code (.claude/)</th>
                  <th>Gemini CLI (.gemini/)</th>
                  <th>OpenAI Codex (.agents/)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.cellLabel}>Project Context</td>
                  <td><code>CLAUDE.md</code></td>
                  <td><code>GEMINI.md</code></td>
                  <td><code>AGENTS.md</code></td>
                </tr>
                <tr>
                  <td className={styles.cellLabel}>Rules Engine</td>
                  <td><code>.claude/rules/*.md</code></td>
                  <td><code>GEMINI.md (instructions)</code></td>
                  <td><code>.agents/rules/</code></td>
                </tr>
                <tr>
                  <td className={styles.cellLabel}>Capability Unit</td>
                  <td><code>.claude/skills/</code></td>
                  <td><code>Extensions / MCP</code></td>
                  <td><code>.agents/skills/</code></td>
                </tr>
                <tr>
                  <td className={styles.cellLabel}>Subagents</td>
                  <td><code>.claude/agents/</code></td>
                  <td><code>/agents list</code></td>
                  <td><code>config.toml</code></td>
                </tr>
                <tr>
                  <td className={styles.cellLabel}>Commands</td>
                  <td><code>.claude/commands/</code></td>
                  <td><code>.toml (slash commands)</code></td>
                  <td><code>PLANS.md / ExecPlans</code></td>
                </tr>
                <tr>
                  <td className={styles.cellLabel}>Settings</td>
                  <td><code>settings.json</code></td>
                  <td><code>settings.json</code></td>
                  <td><code>config.toml</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />

      <SkillDetailModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
    </>
  );
}
