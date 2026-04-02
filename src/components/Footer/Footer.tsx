import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logoRow}>
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="var(--dark-green)"/>
                <path d="M8 14L12 10L16 14L12 18L8 14Z" fill="var(--accent-lime)"/>
                <path d="M12 10L16 6L20 10L16 14L12 10Z" fill="var(--accent-teal)" opacity="0.8"/>
                <path d="M16 14L20 10L24 14L20 18L16 14Z" fill="var(--accent-mint)" opacity="0.6"/>
              </svg>
              <span className={styles.brandName}>Agent Skills Directory</span>
            </div>
            <p className={styles.brandDesc}>
              Discover, install, and manage reusable AI agent skills for Claude Code, OpenAI Codex, and Gemini CLI.
            </p>
          </div>

          <div className={styles.linksGrid}>
            <div className={styles.linkCol}>
              <h4>Agents</h4>
              <a href="https://code.claude.com" target="_blank" rel="noopener">Claude Code</a>
              <a href="https://developers.openai.com/codex" target="_blank" rel="noopener">OpenAI Codex</a>
              <a href="https://geminicli.com" target="_blank" rel="noopener">Gemini CLI</a>
            </div>
            <div className={styles.linkCol}>
              <h4>Resources</h4>
              <a href="https://github.com/vercel-labs/skills" target="_blank" rel="noopener">Skills CLI</a>
              <a href="https://skills.sh" target="_blank" rel="noopener">Skills.sh</a>
              <a href="https://github.com/anthropics/skills" target="_blank" rel="noopener">Anthropic Skills</a>
            </div>
            <div className={styles.linkCol}>
              <h4>Docs</h4>
              <a href="https://vercel.com/kb/guide/agent-skills-creating-installing-and-sharing-reusable-agent-context" target="_blank" rel="noopener">Agent Skills Guide</a>
              <a href="https://geminicli.com/docs/cli/skills/" target="_blank" rel="noopener">Gemini Skills</a>
              <a href="https://developers.openai.com/codex/skills" target="_blank" rel="noopener">Codex Skills</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copy}>
            © {new Date().getFullYear()} Agent Skills Directory. Open Source.
          </span>
          <span className={styles.powered}>
            Powered by GitHub API • Data refreshes every 5 minutes
          </span>
        </div>
      </div>
    </footer>
  );
}
