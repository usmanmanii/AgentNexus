import { getOfficialCreators } from '@/lib/github';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Image from 'next/image';
import styles from './page.module.css';

export const revalidate = 600;

export default async function OfficialPage() {
  const creators = await getOfficialCreators();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.header}>
          <h1 className={styles.title}>Official</h1>
          <p className={styles.desc}>
            Official skills from the companies and organizations that build the technology &mdash; the makers teaching you how to use their products.
          </p>
        </section>

        <div className={styles.table}>
          <div className={styles.thead}>
            <div className={styles.colCreator}>CREATOR</div>
            <div className={styles.colStats}>REPOS</div>
            <div className={styles.colStats}>SKILLS</div>
          </div>
          <div className={styles.tbody}>
            {creators.map((c) => (
              <div key={c.name} className={styles.row}>
                <div className={styles.colCreator}>
                  {c.avatarUrl ? (
                    <Image src={c.avatarUrl} alt={c.name} width={24} height={24} className={styles.avatar} />
                  ) : (
                    <div className={styles.avatarFallback}>{c.name.charAt(0).toUpperCase()}</div>
                  )}
                  <span className={styles.creatorName}>{c.name}</span>
                  <span className={styles.repoName}>{c.repo}</span>
                </div>
                <div className={styles.colStats}>{c.repos}</div>
                <div className={styles.colStats}>{c.skills}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
