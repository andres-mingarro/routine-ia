'use client';

import { useState } from 'react';
import { Routine, RoutineDay, Exercise } from '@/types';
import DayCard from '@/components/DayCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Sparkles, RefreshCw, Calendar } from 'lucide-react';
import styles from './WeeklyRoutine.module.scss';

interface WeeklyRoutineProps {
  routine: (Routine & { days: (RoutineDay & { exercises: Exercise[] })[] }) | null;
  onGenerate: () => Promise<void>;
  isLoading: boolean;
}

function getCurrentDayOfWeek(): number {
  const day = new Date().getDay();
  return day === 0 ? 7 : day; // Convert Sunday (0) to 7
}

export default function WeeklyRoutine({
  routine,
  onGenerate,
  isLoading,
}: WeeklyRoutineProps) {
  const [generating, setGenerating] = useState(false);
  const todayDay = getCurrentDayOfWeek();

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await onGenerate();
    } finally {
      setGenerating(false);
    }
  };

  const isGenerating = isLoading || generating;

  if (isGenerating) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner
          message="La IA está creando tu rutina personalizada..."
          size="lg"
        />
        <div className={styles.loadingTips}>
          <p className={styles.loadingTip}>Analizando tu perfil físico</p>
          <p className={styles.loadingTip}>Revisando tu historial de ejercicios</p>
          <p className={styles.loadingTip}>Generando el plan óptimo de entrenamiento</p>
        </div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <Sparkles size={48} />
        </div>
        <h2 className={styles.emptyTitle}>Sin rutina todavía</h2>
        <p className={styles.emptyDescription}>
          Generá tu rutina semanal personalizada basada en tu perfil físico y tu historial de entrenamiento.
        </p>
        <button className={styles.generateButton} onClick={handleGenerate}>
          <Sparkles size={18} />
          Generar mi Rutina
        </button>
      </div>
    );
  }

  const sortedDays = routine.days
    ? [...routine.days].sort((a, b) => a.day_of_week - b.day_of_week)
    : [];

  const weekStartFormatted = new Date(routine.week_start_date + 'T00:00:00').toLocaleDateString(
    'es-AR',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  );

  return (
    <div className={styles.container}>
      <div className={styles.routineHeader}>
        <div className={styles.weekInfo}>
          <Calendar size={16} className={styles.calendarIcon} />
          <span>Semana del {weekStartFormatted}</span>
        </div>
        <button
          className={styles.regenerateButton}
          onClick={handleGenerate}
          disabled={isGenerating}
          title="Generar nueva rutina"
        >
          <RefreshCw size={16} className={isGenerating ? styles.spinning : ''} />
          Nueva Rutina
        </button>
      </div>

      <div className={styles.daysList}>
        {sortedDays.map((day) => (
          <DayCard
            key={day.id}
            day={day}
            isToday={day.day_of_week === todayDay}
          />
        ))}
      </div>

      <div className={styles.restDay}>
        <span className={styles.restEmoji}>😴</span>
        <div className={styles.restInfo}>
          <span className={styles.restDay2}>Domingo</span>
          <span className={styles.restLabel}>Día de Descanso — Recuperación</span>
        </div>
      </div>
    </div>
  );
}
