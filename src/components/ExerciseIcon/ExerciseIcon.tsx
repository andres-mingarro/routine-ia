'use client';

import {
  IconBarbell,
  IconRun,
  IconBike,
  IconYoga,
  IconWalk,
  IconArrowsUpDown,
  IconArrowsLeftRight,
  IconRotate,
  IconFlame,
  IconStretching,
  IconSwimming,
} from '@tabler/icons-react';
import { getCategoryColor, getExerciseIcon } from '@/lib/exercises';
import styles from './ExerciseIcon.module.scss';

type TablerIcon = typeof IconBarbell;

const EXERCISE_ICONS: Record<string, TablerIcon> = {
  // Barbell / dumbbell press movements
  press: IconBarbell,
  banca: IconBarbell,
  inclinado: IconBarbell,
  declinado: IconBarbell,
  militar: IconBarbell,
  arnold: IconBarbell,
  francés: IconBarbell,
  frances: IconBarbell,
  curl: IconBarbell,
  remo: IconBarbell,
  jalón: IconBarbell,
  jalon: IconBarbell,
  peso: IconBarbell,
  sentadilla: IconBarbell,
  prensa: IconBarbell,
  extensión: IconBarbell,
  extension: IconBarbell,
  predicador: IconBarbell,

  // Vertical body movements
  dominadas: IconArrowsUpDown,
  fondos: IconArrowsUpDown,
  hip: IconArrowsUpDown,
  elevación: IconArrowsUpDown,
  elevacion: IconArrowsUpDown,
  rueda: IconArrowsUpDown,
  crunch: IconArrowsUpDown,

  // Lateral / fly movements
  aperturas: IconArrowsLeftRight,
  lateral: IconArrowsLeftRight,
  frontales: IconArrowsLeftRight,
  pájaros: IconArrowsLeftRight,
  pajaros: IconArrowsLeftRight,
  cruces: IconArrowsLeftRight,

  // Rotation / twist
  giros: IconRotate,
  rusos: IconRotate,
  escaladores: IconRun,

  // Walking / lunging
  zancadas: IconWalk,
  zancada: IconWalk,
  camina: IconWalk,
  step: IconWalk,

  // Core / stability
  plancha: IconStretching,
  plank: IconStretching,
  abdominal: IconStretching,
  yoga: IconYoga,

  // Cardio
  cinta: IconRun,
  running: IconRun,
  correr: IconRun,
  bicicleta: IconBike,
  bike: IconBike,
  ciclismo: IconBike,
  burpees: IconFlame,
  burpee: IconFlame,
  battle: IconFlame,
  natación: IconSwimming,
  natacion: IconSwimming,
};

function getTablerIcon(exerciseName: string): TablerIcon {
  const lower = exerciseName.toLowerCase();
  for (const [keyword, IconComponent] of Object.entries(EXERCISE_ICONS)) {
    if (lower.includes(keyword)) return IconComponent;
  }
  return IconBarbell;
}

interface ExerciseIconProps {
  exerciseName: string;
  iconName?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_PX: Record<string, number> = { sm: 18, md: 24, lg: 30 };

export default function ExerciseIcon({ exerciseName, size = 'md' }: ExerciseIconProps) {
  const iconInfo = getExerciseIcon(exerciseName);
  const color = getCategoryColor(iconInfo.category);
  const TablerIcon = getTablerIcon(exerciseName);
  const px = SIZE_PX[size];

  return (
    <div
      className={`${styles.iconWrapper} ${styles[size]}`}
      style={{ borderColor: `${color}40`, backgroundColor: `${color}12` }}
    >
      <TablerIcon size={px} stroke={1.75} color={color} />
    </div>
  );
}
