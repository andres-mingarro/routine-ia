'use client';

import { useState } from 'react';
import { RoutineDay, Exercise } from '@/types';
import ExerciseItem from '@/components/ExerciseItem';
import { getMuscleGroupColor, getMuscleGroupLabel, getDayName } from '@/lib/exercises';
import { ChevronDown, ChevronUp, Dumbbell } from 'lucide-react';
import styles from './DayCard.module.scss';

interface DayCardProps {
  day: RoutineDay & { exercises: Exercise[] };
  isToday?: boolean;
}

const DAY_EMOJIS: Record<number, string> = {
  1: '🔴',
  2: '🔵',
  3: '🟣',
  4: '🔴',
  5: '🔵',
  6: '🟢',
};

export default function DayCard({ day, isToday = false }: DayCardProps) {
  const [expanded, setExpanded] = useState(isToday);
  const [exerciseList, setExerciseList] = useState<Exercise[]>(day.exercises ?? []);

  function handleReplace(updated: Exercise) {
    setExerciseList((prev) =>
      prev.map((ex) => (ex.id === updated.id ? { ...ex, ...updated } : ex))
    );
  }
  const color = getMuscleGroupColor(day.muscle_group);
  const label = getMuscleGroupLabel(day.muscle_group);
  const dayName = getDayName(day.day_of_week);
  const dayEmoji = DAY_EMOJIS[day.day_of_week] || '⚪';

  return (
    <div
      className={`${styles.dayCard} ${isToday ? styles.isToday : ''}`}
      style={{
        borderColor: isToday ? color : `${color}30`,
        boxShadow: isToday ? `0 0 20px ${color}25` : 'none',
      }}
    >
      <button
        className={styles.dayHeader}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className={styles.dayInfo}>
          <span className={styles.dayEmoji}>{dayEmoji}</span>
          <div className={styles.dayText}>
            <span className={styles.dayName}>
              {dayName}
              {isToday && <span className={styles.todayBadge}>Hoy</span>}
            </span>
            <span
              className={styles.muscleGroupLabel}
              style={{ color }}
            >
              {label}
            </span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.exerciseCount}>
            <Dumbbell size={14} style={{ color }} />
            <span style={{ color }}>{exerciseList.length}</span>
          </div>
          {expanded ? (
            <ChevronUp size={18} className={styles.chevron} />
          ) : (
            <ChevronDown size={18} className={styles.chevron} />
          )}
        </div>
      </button>

      {expanded && (
        <div className={styles.exerciseList}>
          <div
            className={styles.divider}
            style={{ backgroundColor: `${color}30` }}
          />
          {exerciseList.length > 0 ? (
            exerciseList.map((exercise, index) => (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                index={index}
                onReplace={handleReplace}
              />
            ))
          ) : (
            <p className={styles.noExercises}>Sin ejercicios programados</p>
          )}
        </div>
      )}
    </div>
  );
}
