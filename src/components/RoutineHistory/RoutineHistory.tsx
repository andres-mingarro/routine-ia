'use client';

import { useState } from 'react';
import { Routine, RoutineDay, Exercise } from '@/types';
import { getMuscleGroupColor, getMuscleGroupLabel, getDayName } from '@/lib/exercises';
import ExerciseIcon from '@/components/ExerciseIcon';
import { ChevronDown, ChevronUp, Calendar, Dumbbell } from 'lucide-react';
import styles from './RoutineHistory.module.scss';

interface RoutineHistoryProps {
  routines: (Routine & { days: (RoutineDay & { exercises: Exercise[] })[] })[];
}

function RoutineCard({
  routine,
  index,
}: {
  routine: Routine & { days: (RoutineDay & { exercises: Exercise[] })[] };
  index: number;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  const weekStartFormatted = new Date(routine.week_start_date + 'T00:00:00').toLocaleDateString(
    'es-AR',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  const totalExercises = routine.days?.reduce(
    (sum, day) => sum + (day.exercises?.length || 0),
    0
  ) || 0;

  const sortedDays = routine.days
    ? [...routine.days].sort((a, b) => a.day_of_week - b.day_of_week)
    : [];

  return (
    <div className={styles.routineCard}>
      <button
        className={styles.routineHeader}
        onClick={() => setExpanded(!expanded)}
      >
        <div className={styles.routineInfo}>
          <div className={styles.routineMeta}>
            <Calendar size={14} className={styles.metaIcon} />
            <span>Semana del {weekStartFormatted}</span>
          </div>
          <div className={styles.routineStats}>
            <span className={styles.weekBadge}>Semana #{routine.week_number}</span>
            <span className={styles.exerciseStat}>
              <Dumbbell size={12} />
              {totalExercises} ejercicios
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={16} className={styles.chevron} />
        ) : (
          <ChevronDown size={16} className={styles.chevron} />
        )}
      </button>

      {expanded && (
        <div className={styles.routineContent}>
          {sortedDays.map((day) => {
            const color = getMuscleGroupColor(day.muscle_group);
            const label = getMuscleGroupLabel(day.muscle_group);
            const dayName = getDayName(day.day_of_week);

            return (
              <div
                key={day.id}
                className={styles.daySection}
                style={{ borderLeftColor: color }}
              >
                <div className={styles.dayHeader}>
                  <span className={styles.historyDayName}>{dayName}</span>
                  <span
                    className={styles.historyMuscleLabel}
                    style={{ color }}
                  >
                    {label}
                  </span>
                </div>
                <div className={styles.historyExercises}>
                  {day.exercises?.map((exercise) => (
                    <div key={exercise.id} className={styles.historyExercise}>
                      <ExerciseIcon
                        exerciseName={exercise.name}
                        iconName={exercise.icon_name}
                        size="sm"
                      />
                      <div className={styles.historyExerciseInfo}>
                        <span className={styles.historyExerciseName}>
                          {exercise.name}
                        </span>
                        <span className={styles.historyExerciseSets}>
                          {exercise.sets} x {exercise.reps}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function RoutineHistory({ routines }: RoutineHistoryProps) {
  if (!routines || routines.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyEmoji}>📚</span>
        <h3 className={styles.emptyTitle}>Sin historial aún</h3>
        <p className={styles.emptyDescription}>
          Tus rutinas pasadas aparecerán aquí cuando empieces a entrenar.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.historyList}>
        {routines.map((routine, index) => (
          <RoutineCard key={routine.id} routine={routine} index={index} />
        ))}
      </div>
    </div>
  );
}
