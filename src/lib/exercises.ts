export type ExerciseCategory =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'cardio'
  | 'default';

export interface ExerciseIconInfo {
  emoji: string;
  category: ExerciseCategory;
  lucideIcon?: string;
}

const exerciseIconMap: Record<string, ExerciseIconInfo> = {
  // Chest exercises
  'bench press': { emoji: '🏋️', category: 'chest' },
  'incline bench press': { emoji: '🏋️', category: 'chest' },
  'decline bench press': { emoji: '🏋️', category: 'chest' },
  'dumbbell bench press': { emoji: '🏋️', category: 'chest' },
  'push ups': { emoji: '💪', category: 'chest' },
  'push-ups': { emoji: '💪', category: 'chest' },
  'chest flyes': { emoji: '🦅', category: 'chest' },
  'dumbbell flyes': { emoji: '🦅', category: 'chest' },
  'cable flyes': { emoji: '🦅', category: 'chest' },
  'chest press': { emoji: '🏋️', category: 'chest' },
  'pec deck': { emoji: '🦅', category: 'chest' },
  'cable crossover': { emoji: '🦅', category: 'chest' },

  // Back exercises
  'pull ups': { emoji: '🔝', category: 'back' },
  'pull-ups': { emoji: '🔝', category: 'back' },
  'chin ups': { emoji: '🔝', category: 'back' },
  'lat pulldown': { emoji: '⬇️', category: 'back' },
  'bent over row': { emoji: '🚣', category: 'back' },
  'barbell row': { emoji: '🚣', category: 'back' },
  'dumbbell row': { emoji: '🚣', category: 'back' },
  'seated cable row': { emoji: '🚣', category: 'back' },
  'deadlift': { emoji: '🏗️', category: 'back' },
  'romanian deadlift': { emoji: '🏗️', category: 'back' },
  'face pull': { emoji: '🎯', category: 'back' },
  't-bar row': { emoji: '🚣', category: 'back' },
  'hyperextensions': { emoji: '🔄', category: 'back' },

  // Legs exercises
  'squat': { emoji: '🦵', category: 'legs' },
  'squats': { emoji: '🦵', category: 'legs' },
  'barbell squat': { emoji: '🦵', category: 'legs' },
  'goblet squat': { emoji: '🦵', category: 'legs' },
  'front squat': { emoji: '🦵', category: 'legs' },
  'lunges': { emoji: '🚶', category: 'legs' },
  'lunge': { emoji: '🚶', category: 'legs' },
  'walking lunges': { emoji: '🚶', category: 'legs' },
  'reverse lunges': { emoji: '🚶', category: 'legs' },
  'leg press': { emoji: '🦵', category: 'legs' },
  'leg extension': { emoji: '🦵', category: 'legs' },
  'leg curl': { emoji: '🦵', category: 'legs' },
  'calf raises': { emoji: '👟', category: 'legs' },
  'standing calf raises': { emoji: '👟', category: 'legs' },
  'hip thrust': { emoji: '🍑', category: 'legs' },
  'step ups': { emoji: '🪜', category: 'legs' },
  'box jumps': { emoji: '📦', category: 'legs' },
  'sumo deadlift': { emoji: '🏗️', category: 'legs' },
  'hack squat': { emoji: '🦵', category: 'legs' },

  // Shoulder exercises
  'overhead press': { emoji: '🙌', category: 'shoulders' },
  'military press': { emoji: '🙌', category: 'shoulders' },
  'shoulder press': { emoji: '🙌', category: 'shoulders' },
  'dumbbell shoulder press': { emoji: '🙌', category: 'shoulders' },
  'lateral raises': { emoji: '🦁', category: 'shoulders' },
  'lateral raise': { emoji: '🦁', category: 'shoulders' },
  'front raises': { emoji: '⬆️', category: 'shoulders' },
  'rear delt flyes': { emoji: '🦅', category: 'shoulders' },
  'upright row': { emoji: '⬆️', category: 'shoulders' },
  'arnold press': { emoji: '🙌', category: 'shoulders' },
  'shrugs': { emoji: '🤷', category: 'shoulders' },

  // Arms exercises
  'bicep curls': { emoji: '💪', category: 'arms' },
  'bicep curl': { emoji: '💪', category: 'arms' },
  'barbell curl': { emoji: '💪', category: 'arms' },
  'hammer curls': { emoji: '🔨', category: 'arms' },
  'hammer curl': { emoji: '🔨', category: 'arms' },
  'preacher curl': { emoji: '💪', category: 'arms' },
  'concentration curl': { emoji: '💪', category: 'arms' },
  'tricep extensions': { emoji: '🦾', category: 'arms' },
  'tricep extension': { emoji: '🦾', category: 'arms' },
  'tricep pushdown': { emoji: '⬇️', category: 'arms' },
  'skull crushers': { emoji: '💀', category: 'arms' },
  'dips': { emoji: '⬇️', category: 'arms' },
  'close grip bench': { emoji: '🏋️', category: 'arms' },
  'overhead tricep extension': { emoji: '🦾', category: 'arms' },
  'cable curl': { emoji: '💪', category: 'arms' },
  'ez bar curl': { emoji: '💪', category: 'arms' },

  // Core exercises
  'plank': { emoji: '🧱', category: 'core' },
  'planks': { emoji: '🧱', category: 'core' },
  'crunches': { emoji: '🌀', category: 'core' },
  'crunch': { emoji: '🌀', category: 'core' },
  'russian twists': { emoji: '🌪️', category: 'core' },
  'russian twist': { emoji: '🌪️', category: 'core' },
  'leg raises': { emoji: '🦵', category: 'core' },
  'hanging leg raises': { emoji: '🦵', category: 'core' },
  'ab wheel': { emoji: '⚙️', category: 'core' },
  'bicycle crunches': { emoji: '🚴', category: 'core' },
  'mountain climbers': { emoji: '🏔️', category: 'core' },
  'sit ups': { emoji: '🌀', category: 'core' },
  'sit-ups': { emoji: '🌀', category: 'core' },
  'cable crunch': { emoji: '🌀', category: 'core' },

  // Cardio exercises
  'running': { emoji: '🏃', category: 'cardio' },
  'treadmill': { emoji: '🏃', category: 'cardio' },
  'cycling': { emoji: '🚴', category: 'cardio' },
  'stationary bike': { emoji: '🚴', category: 'cardio' },
  'jump rope': { emoji: '⚡', category: 'cardio' },
  'burpees': { emoji: '💥', category: 'cardio' },
  'jumping jacks': { emoji: '⭐', category: 'cardio' },
  'rowing machine': { emoji: '🚣', category: 'cardio' },
  'elliptical': { emoji: '🔄', category: 'cardio' },
  'stairmaster': { emoji: '🪜', category: 'cardio' },
  'battle ropes': { emoji: '🌊', category: 'cardio' },
};

export function getExerciseIcon(exerciseName: string): ExerciseIconInfo {
  const normalized = exerciseName.toLowerCase().trim();

  // Try exact match first
  if (exerciseIconMap[normalized]) {
    return exerciseIconMap[normalized];
  }

  // Try partial match
  for (const [key, value] of Object.entries(exerciseIconMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  // Category detection from name
  if (normalized.includes('chest') || normalized.includes('pec')) {
    return { emoji: '🏋️', category: 'chest' };
  }
  if (normalized.includes('back') || normalized.includes('row') || normalized.includes('pull')) {
    return { emoji: '🚣', category: 'back' };
  }
  if (normalized.includes('leg') || normalized.includes('squat') || normalized.includes('lunge')) {
    return { emoji: '🦵', category: 'legs' };
  }
  if (normalized.includes('shoulder') || normalized.includes('delt')) {
    return { emoji: '🙌', category: 'shoulders' };
  }
  if (normalized.includes('bicep') || normalized.includes('curl') || normalized.includes('tricep')) {
    return { emoji: '💪', category: 'arms' };
  }
  if (normalized.includes('core') || normalized.includes('ab') || normalized.includes('plank')) {
    return { emoji: '🧱', category: 'core' };
  }
  if (normalized.includes('cardio') || normalized.includes('run') || normalized.includes('bike')) {
    return { emoji: '🏃', category: 'cardio' };
  }

  return { emoji: '🏋️', category: 'default' };
}

export function getCategoryColor(category: ExerciseCategory): string {
  const colors: Record<ExerciseCategory, string> = {
    chest: '#ef4444',
    back: '#3b82f6',
    legs: '#8b5cf6',
    shoulders: '#f59e0b',
    arms: '#10b981',
    core: '#f97316',
    cardio: '#ec4899',
    default: '#6b7280',
  };
  return colors[category] || colors.default;
}

export function getMuscleGroupColor(muscleGroup: string): string {
  const colors: Record<string, string> = {
    push: '#ef4444',
    pull: '#3b82f6',
    legs: '#8b5cf6',
    full_body: '#10b981',
    rest: '#6b7280',
  };
  return colors[muscleGroup] || '#6b7280';
}

export function getMuscleGroupLabel(muscleGroup: string): string {
  const labels: Record<string, string> = {
    push: 'Día de Empuje',
    pull: 'Día de Tirón',
    legs: 'Día de Piernas',
    full_body: 'Cuerpo Completo',
    rest: 'Día de Descanso',
  };
  return labels[muscleGroup] || muscleGroup;
}

const alternativesByCategory: Record<ExerciseCategory, string[]> = {
  chest: [
    'Press de Banca',
    'Press Inclinado con Mancuernas',
    'Aperturas con Cable',
    'Fondos en Paralelas',
    'Press Declinado',
    'Pullover con Mancuerna',
    'Press con Mancuernas',
    'Aperturas en Banco Plano',
    'Cruces en Polea Alta',
  ],
  back: [
    'Jalón al Pecho',
    'Remo con Barra',
    'Remo con Mancuerna',
    'Dominadas',
    'Remo en Polea Baja',
    'Face Pull',
    'Pullover en Polea',
    'Remo en Máquina',
    'Hiperextensiones',
    'Remo T-Bar',
  ],
  legs: [
    'Sentadilla con Barra',
    'Prensa de Piernas',
    'Extensión de Cuádriceps',
    'Curl de Isquiotibiales',
    'Zancadas',
    'Peso Muerto Rumano',
    'Hip Thrust',
    'Elevaciones de Talones',
    'Sentadilla Goblet',
    'Sentadilla Hack',
  ],
  shoulders: [
    'Press Militar',
    'Press Arnold',
    'Elevaciones Laterales',
    'Elevaciones Frontales',
    'Remo al Mentón',
    'Pájaros',
    'Press con Mancuernas',
    'Encogimientos de Hombros',
    'Press en Máquina',
  ],
  arms: [
    'Curl de Bíceps con Barra',
    'Curl Martillo',
    'Curl Predicador',
    'Extensión de Tríceps en Polea',
    'Press Francés',
    'Fondos Tríceps',
    'Curl con Cable',
    'Curl Concentrado',
    'Extensión de Tríceps sobre la Cabeza',
    'Curl EZ',
  ],
  core: [
    'Plancha',
    'Crunch Abdominal',
    'Elevación de Piernas',
    'Rueda Abdominal',
    'Giros Rusos',
    'Escaladores',
    'Crunch en Polea',
    'Plancha Lateral',
    'Dead Bug',
    'Hollow Hold',
  ],
  cardio: [
    'Cinta de Correr',
    'Bicicleta Estática',
    'Cuerda para Saltar',
    'Burpees',
    'Remo Ergómetro',
    'Elíptica',
    'Escaladora',
    'Battle Ropes',
  ],
  default: [
    'Press de Banca',
    'Sentadilla con Barra',
    'Dominadas',
    'Plancha',
    'Burpees',
    'Remo con Barra',
  ],
};

export function getAlternativeExercises(category: ExerciseCategory): string[] {
  return alternativesByCategory[category] ?? alternativesByCategory['default'];
}

export function getDayName(dayOfWeek: number): string {
  const days: Record<number, string> = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
    7: 'Domingo',
  };
  return days[dayOfWeek] || `Día ${dayOfWeek}`;
}
