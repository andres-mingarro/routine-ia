'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import WeeklyRoutine from '@/components/WeeklyRoutine';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Routine, RoutineDay, Exercise } from '@/types';
import styles from './routine.module.scss';

type FullRoutine = Routine & { days: (RoutineDay & { exercises: Exercise[] })[] };

export default function RoutinePage() {
  const router = useRouter();
  const [routine, setRoutine] = useState<FullRoutine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkUser = useCallback(async () => {
    try {
      const res = await fetch('/api/user');
      const data = await res.json();
      if (!data.user) {
        router.push('/setup');
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }, [router]);

  const fetchRoutine = useCallback(async () => {
    try {
      const res = await fetch('/api/generate-routine');
      if (!res.ok) throw new Error('Failed to fetch routine');
      const data = await res.json();
      setRoutine(data.routine || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load routine');
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const hasUser = await checkUser();
      if (hasUser) {
        await fetchRoutine();
      }
      setIsLoading(false);
    };
    init();
  }, [checkUser, fetchRoutine]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-routine', {
        method: 'POST',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate routine');
      }
      const data = await res.json();
      setRoutine(data.routine);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate routine');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        <Header
          title="Esta Semana"
          subtitle="Tu plan de entrenamiento con IA"
        />

        {isLoading ? (
          <LoadingSpinner message="Cargando tu rutina..." size="md" />
        ) : (
          <>
            {error && (
              <div className={styles.errorBanner}>
                <span>⚠️</span>
                <span>{error}</span>
                <button
                  className={styles.dismissError}
                  onClick={() => setError(null)}
                >
                  ✕
                </button>
              </div>
            )}
            <WeeklyRoutine
              routine={routine}
              onGenerate={handleGenerate}
              isLoading={isGenerating}
            />
          </>
        )}
      </main>
      <Navigation />
    </div>
  );
}
