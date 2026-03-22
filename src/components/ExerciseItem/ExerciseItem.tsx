'use client';

import { useState } from 'react';
import ExerciseIcon from '@/components/ExerciseIcon';
import ExerciseSwap from '@/components/ExerciseSwap';
import { Exercise } from '@/types';
import { getExerciseIcon } from '@/lib/exercises';
import { Clock, RotateCcw, ArrowLeftRight } from 'lucide-react';
import styles from './ExerciseItem.module.scss';

const DEFAULT_USER_ID = 1;

interface ExerciseItemProps {
  exercise: Exercise;
  index: number;
  onReplace?: (updated: Exercise) => void;
}

export default function ExerciseItem({ exercise, index, onReplace }: ExerciseItemProps) {
  const [swapOpen, setSwapOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise>(exercise);

  const restMinutes = Math.floor(currentExercise.rest_seconds / 60);
  const restSecs = currentExercise.rest_seconds % 60;
  const restLabel =
    restMinutes > 0
      ? restSecs > 0
        ? `${restMinutes}m ${restSecs}s`
        : `${restMinutes}m`
      : `${restSecs}s`;

  const iconInfo = getExerciseIcon(currentExercise.name);

  function handleReplaced(updated: Exercise) {
    setCurrentExercise(updated);
    setSwapOpen(false);
    onReplace?.(updated);
  }

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.exerciseItem} ${swapOpen ? styles.swapActive : ''}`}>
        <div className={styles.indexBadge}>{index + 1}</div>

        <ExerciseIcon exerciseName={currentExercise.name} iconName={currentExercise.icon_name} size="md" />

        <div className={styles.exerciseInfo}>
          <h4 className={styles.exerciseName}>{currentExercise.name}</h4>
          {currentExercise.notes && (
            <p className={styles.exerciseNotes}>{currentExercise.notes}</p>
          )}
        </div>

        <div className={styles.exerciseStats}>
          <div className={styles.stat}>
            <RotateCcw size={12} className={styles.statIcon} />
            <span className={styles.statValue}>
              {currentExercise.sets} x {currentExercise.reps}
            </span>
          </div>
          <div className={styles.stat}>
            <Clock size={12} className={styles.statIcon} />
            <span className={styles.statValue}>{restLabel}</span>
          </div>
        </div>

        <button
          className={`${styles.swapBtn} ${swapOpen ? styles.swapBtnActive : ''}`}
          onClick={() => setSwapOpen((o) => !o)}
          title="Cambiar ejercicio"
          aria-label="Cambiar ejercicio"
        >
          <ArrowLeftRight size={14} />
        </button>
      </div>

      {swapOpen && (
        <ExerciseSwap
          exercise={currentExercise}
          category={iconInfo.category}
          userId={DEFAULT_USER_ID}
          onReplace={handleReplaced}
          onClose={() => setSwapOpen(false)}
        />
      )}
    </div>
  );
}
