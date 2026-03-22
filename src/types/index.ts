export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6;

export type MuscleGroup =
  | 'push'
  | 'pull'
  | 'legs'
  | 'full_body'
  | 'rest';

export interface User {
  id: number;
  weight: number;
  height: number;
  experience: ExperienceLevel;
  created_at: Date;
  updated_at: Date;
}

export interface Routine {
  id: number;
  user_id: number;
  week_start_date: string;
  week_number: number;
  created_at: Date;
  days?: RoutineDay[];
}

export interface RoutineDay {
  id: number;
  routine_id: number;
  day_of_week: DayOfWeek;
  muscle_group: MuscleGroup;
  exercises?: Exercise[];
}

export interface Exercise {
  id: number;
  routine_day_id: number;
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes: string | null;
  icon_name: string;
  order: number;
}

export interface UserFormData {
  weight: number;
  height: number;
  experience: ExperienceLevel;
}

export interface GenerateRoutineResponse {
  success: boolean;
  routine?: Routine;
  error?: string;
}

export interface AIExercise {
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
  icon_name: string;
}

export interface AIRoutineDay {
  day_of_week: DayOfWeek;
  muscle_group: MuscleGroup;
  exercises: AIExercise[];
}

export interface AIRoutineResponse {
  days: AIRoutineDay[];
}
