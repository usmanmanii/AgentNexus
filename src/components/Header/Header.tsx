'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Official', path: '/official', isNew: true },
    { name: 'Audits', path: '/audits' },
    { name: 'Docs', path: '/docs' },
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.icon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22h20L12 2z" fill="currentColor"/>
            </svg>
          </div>
          <span className={styles.logoText}>Skills</span>
        </Link>
        
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`${styles.navLink} ${pathname === link.path ? styles.active : ''}`}
            >
              {link.name}
              {link.isNew && <span className={styles.newBadge}>NEW</span>}
            </Link>
          ))}
          <a
            href="https://github.com/vercel-labs/skills"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubBtn}
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
