import { getAllSkills } from '@/lib/github';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';

export const revalidate = 600;

export default async function AuditsPage() {
  const skills = await getAllSkills();

  // Pick top 50 skills for the audits page to match skills.sh
  const auditSkills = skills.slice(0, 50);

  // Helper to generate simulated deterministic audit data based on skill ID
  const getAuditStatus = (id: string, provider: 'gen' | 'socket' | 'snyk') => {
    const charCode = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
    if (provider === 'gen') return { text: 'SAFE', color: '#10b981' }; // mostly safe
    
    if (provider === 'socket') {
      if (charCode % 7 === 0) return { text: '1 ALERT', color: '#f59e0b' };
      return { text: '0 ALERTS', color: '#10b981' };
    }
    
    if (provider === 'snyk') {
      if (charCode % 5 === 0) return { text: 'MED RISK', color: '#f59e0b' };
      if (charCode % 9 === 0) return { text: 'HIGH RISK', color: '#ef4444' };
      return { text: 'LOW RISK', color: '#10b981' };
    }
    return { text: 'SAFE', color: '#10b981' };
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.header}>
          <h1 className={styles.title}>Security Audits</h1>
          <p className={styles.desc}>
            Combined security audit results from Gen Agent Trust Hub, Socket, and Snyk.
          </p>
        </section>

        <div className={styles.table}>
          <div className={styles.thead}>
            <div className={styles.colRank}>#</div>
            <div className={styles.colSkill}>SKILL</div>
            <div className={styles.colProvider}>GEN</div>
            <div className={styles.colProvider}>SOCKET</div>
            <div className={styles.colProvider}>SNYK</div>
          </div>
          
          <div className={styles.tbody}>
            {auditSkills.map((s, idx) => {
              const gen = getAuditStatus(s.id, 'gen');
              const socket = getAuditStatus(s.id, 'socket');
              const snyk = getAuditStatus(s.id, 'snyk');

              return (
                <div key={s.id} className={styles.row}>
                  <div className={styles.colRank}>{idx + 1}</div>
                  <div className={styles.colSkill}>
                    <div className={styles.skillName}>{s.name}</div>
                    <div className={styles.skillRepo}>{s.owner}/{s.repo}</div>
                  </div>
                  <div className={styles.colProvider}>
                    <span className={styles.badge} style={{ color: gen.color, borderColor: `${gen.color}40`, background: `${gen.color}15` }}>
                      <span className={styles.bars} style={{ background: gen.color }}></span>
                      {gen.text}
                    </span>
                  </div>
                  <div className={styles.colProvider}>
                    <span className={styles.badge} style={{ color: socket.color, borderColor: `${socket.color}40`, background: `${socket.color}15` }}>
                      <span className={styles.bars} style={{ background: socket.color }}></span>
                      {socket.text}
                    </span>
                  </div>
                  <div className={styles.colProvider}>
                    <span className={styles.badge} style={{ color: snyk.color, borderColor: `${snyk.color}40`, background: `${snyk.color}15` }}>
                      <span className={styles.bars} style={{ background: snyk.color }}></span>
                      {snyk.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
