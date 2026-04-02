import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';

export default function DocsPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <nav>
            <ul>
              <li className={styles.active}>Overview</li>
              <li>CLI</li>
              <li>FAQ</li>
            </ul>
          </nav>
        </aside>

        <article className={styles.content}>
          <h1 className={styles.title}>Documentation</h1>
          <p className={styles.lead}>
            Learn how to discover, install, and use skills with your AI agents.
          </p>
          
          <p className={styles.text}>
            The <code>skills</code> CLI that powers this leaderboard is open source at <a href="https://github.com/vercel-labs/skills">github.com/vercel-labs/skills</a>.
          </p>

          <h2 className={styles.h2}>What are skills?</h2>
          <p className={styles.text}>
            Skills are reusable capabilities for AI agents. They provide procedural knowledge that helps agents accomplish specific tasks more effectively. Think of them as plugins or extensions that enhance what your AI agent can do.
          </p>

          <h2 className={styles.h2}>Getting started</h2>
          <p className={styles.text}>
            To install a skill, use the <code>skills</code> CLI:
          </p>
          <div className={styles.codeBlock}>
            <code>npx skills add vercel-labs/agent-skills</code>
          </div>
          <p className={styles.text}>
            This will install the skill and make it available to your AI agent.
          </p>

          <h2 className={styles.h2}>How skills are ranked</h2>
          <p className={styles.text}>
            The skills leaderboard ranks skills based on anonymous telemetry data collected from the <code>skills</code> CLI. When users install skills, aggregated usage data helps surface the most popular and useful skills in the ecosystem.
          </p>
          <p className={styles.text}>
            This telemetry is completely anonymous and only tracks which skills are being installed&mdash;no personal information or usage patterns are collected.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
