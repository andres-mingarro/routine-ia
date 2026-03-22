'use client';

import { Dumbbell } from 'lucide-react';
import styles from './Header.module.scss';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.logoMark}>
        <Dumbbell size={20} className={styles.logoIcon} />
      </div>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </header>
  );
}
