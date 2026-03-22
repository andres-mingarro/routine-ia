'use client';

import { useState } from 'react';
import { Exercise } from '@/types';
import { ExerciseCategory, getAlternativeExercises, getExerciseIcon } from '@/lib/exercises';
import styles from './ExerciseSwap.module.scss';

interface ExerciseSwapProps {
  exercise: Exercise;
  category: ExerciseCategory;
  userId: number;
  onReplace: (updated: Exercise) => void;
  onClose: () => void;
}

export default function ExerciseSwap({
  exercise,
  category,
  userId,
  onReplace,
  onClose,
}: ExerciseSwapProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const alternatives = getAlternativeExercises(category).filter(
    (name) => name.toLowerCase() !== exercise.name.toLowerCase()
  );

  async function handlePick(newName: string) {
    setLoading(newName);
    try {
      const res = await fetch('/api/replace-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise_id: exercise.id,
          new_name: newName,
          disliked_name: exercise.name,
          user_id: userId,
        }),
      });

      if (!res.ok) {
        throw new Error('Error al reemplazar el ejercicio');
      }

      const data = await res.json();
      setSuccess(newName);
      setTimeout(() => {
        onReplace(data.exercise as Exercise);
      }, 700);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Elegí un ejercicio alternativo</span>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
      </div>
      <p className={styles.subtitle}>
        Reemplazando: <strong>{exercise.name}</strong>
      </p>
      <div className={styles.grid}>
        {alternatives.map((name) => {
          const icon = getExerciseIcon(name);
          const isLoading = loading === name;
          const isDone = success === name;
          return (
            <button
              key={name}
              className={`${styles.option} ${isDone ? styles.done : ''}`}
              onClick={() => handlePick(name)}
              disabled={loading !== null || success !== null}
            >
              <span className={styles.optionEmoji}>{isDone ? '✅' : icon.emoji}</span>
              <span className={styles.optionName}>{isLoading ? 'Guardando…' : name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
