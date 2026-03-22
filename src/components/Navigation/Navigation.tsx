'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, History, Settings } from 'lucide-react';
import styles from './Navigation.module.scss';

const NAV_ITEMS = [
  { href: '/routine', label: 'Rutina', icon: Dumbbell },
  { href: '/history', label: 'Historial', icon: History },
  { href: '/setup', label: 'Perfil', icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={22} className={styles.navIcon} />
              <span className={styles.navLabel}>{label}</span>
              {isActive && <span className={styles.activeIndicator} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
