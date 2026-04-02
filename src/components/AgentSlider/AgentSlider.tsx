import styles from './AgentSlider.module.css';

const agents = [
  { name: 'Antigravity', icon: '🔷' },
  { name: 'Claude Code', icon: '🟠' },
  { name: 'Cline', icon: '⚡' },
  { name: 'Codex', icon: '🔵' },
  { name: 'Cursor', icon: '💠' },
  { name: 'Gemini CLI', icon: '🟢' },
  { name: 'GitHub Copilot', icon: '🐙' },
  { name: 'Trae', icon: '🔮' },
  { name: 'VS Code', icon: '💎' },
  { name: 'Windsurf', icon: '🌊' },
  { name: 'Aider', icon: '🤖' },
  { name: 'OpenCode', icon: '📦' },
];

export default function AgentSlider() {
  return (
    <section className={styles.section}>
      <h2 className={styles.label}>AVAILABLE FOR THESE AGENTS</h2>
      <div className={styles.sliderTrack}>
        <div className={styles.sliderInner}>
          {[...agents, ...agents].map((agent, i) => (
            <div key={i} className={styles.agentItem} title={agent.name}>
              <span className={styles.agentIcon}>{agent.icon}</span>
              <span className={styles.agentName}>{agent.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
