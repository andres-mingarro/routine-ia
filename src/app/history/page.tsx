'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import RoutineHistory from '@/components/RoutineHistory';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Routine, RoutineDay, Exercise } from '@/types';
import styles from './history.module.scss';

type FullRoutine = Routine & { days: (RoutineDay & { exercises: Exercise[] })[] };

export default function HistoryPage() {
  const [routines, setRoutines] = useState<FullRoutine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history');
        if (!res.ok) throw new Error('Failed to fetch history');
        const data = await res.json();
        setRoutines(data.routines || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        <Header
          title="Historial"
          subtitle={`${routines.length} rutina${routines.length !== 1 ? 's' : ''} completada${routines.length !== 1 ? 's' : ''}`}
        />

        {isLoading ? (
          <LoadingSpinner message="Cargando historial..." size="md" />
        ) : error ? (
          <div className={styles.errorMessage}>
            <span>⚠️</span>
            {error}
          </div>
        ) : (
          <RoutineHistory routines={routines} />
        )}
      </main>
      <Navigation />
    </div>
  );
}
