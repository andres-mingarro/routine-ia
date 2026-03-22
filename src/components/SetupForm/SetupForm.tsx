'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Zap, Target } from 'lucide-react';
import { UserFormData, ExperienceLevel } from '@/types';
import styles from './SetupForm.module.scss';

interface SetupFormProps {
  initialData?: Partial<UserFormData>;
  onSave?: (data: UserFormData) => void;
}

const EXPERIENCE_OPTIONS: {
  value: ExperienceLevel;
  label: string;
  description: string;
  emoji: string;
}[] = [
  {
    value: 'beginner',
    label: 'Principiante',
    description: 'Menos de 1 año entrenando',
    emoji: '🌱',
  },
  {
    value: 'intermediate',
    label: 'Intermedio',
    description: '1-3 años entrenando regularmente',
    emoji: '💪',
  },
  {
    value: 'advanced',
    label: 'Avanzado',
    description: 'Más de 3 años entrenando en serio',
    emoji: '🏆',
  },
];

export default function SetupForm({ initialData, onSave }: SetupFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<UserFormData>({
    weight: initialData?.weight || 70,
    height: initialData?.height || 175,
    experience: initialData?.experience || 'beginner',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      if (onSave) {
        onSave(formData);
      }

      router.push('/routine');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const bmi = formData.weight && formData.height
    ? (formData.weight / ((formData.height / 100) ** 2)).toFixed(1)
    : null;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <User size={18} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Medidas Corporales</h2>
        </div>

        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="weight">
              Peso
              <span className={styles.unit}>kg</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="weight"
                type="number"
                min="30"
                max="300"
                step="0.5"
                className={styles.input}
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: parseFloat(e.target.value) })
                }
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="height">
              Altura
              <span className={styles.unit}>cm</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="height"
                type="number"
                min="100"
                max="250"
                step="1"
                className={styles.input}
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: parseFloat(e.target.value) })
                }
                required
              />
            </div>
          </div>
        </div>

        {bmi && (
          <div className={styles.bmiCard}>
            <Target size={14} className={styles.bmiIcon} />
            <span className={styles.bmiLabel}>BMI:</span>
            <span className={styles.bmiValue}>{bmi}</span>
            <span className={styles.bmiCategory}>{getBmiCategory(parseFloat(bmi))}</span>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Zap size={18} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Nivel de Experiencia</h2>
        </div>

        <div className={styles.experienceGrid}>
          {EXPERIENCE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`${styles.experienceCard} ${
                formData.experience === option.value ? styles.selected : ''
              }`}
            >
              <input
                type="radio"
                name="experience"
                value={option.value}
                checked={formData.experience === option.value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience: e.target.value as ExperienceLevel,
                  })
                }
                className={styles.hiddenRadio}
              />
              <span className={styles.experienceEmoji}>{option.emoji}</span>
              <span className={styles.experienceLabel}>{option.label}</span>
              <span className={styles.experienceDescription}>
                {option.description}
              </span>
              <div className={styles.selectedIndicator} />
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <span>⚠️</span>
          {error}
        </div>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className={styles.buttonSpinner} />
            Guardando...
          </>
        ) : (
          <>
            <Zap size={18} />
            Guardar y Continuar
          </>
        )}
      </button>
    </form>
  );
}

function getBmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Bajo peso';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidad';
}
