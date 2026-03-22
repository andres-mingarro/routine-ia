import { pgTable, serial, text, integer, timestamp, date, real } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  weight: real('weight').notNull(),
  height: real('height').notNull(),
  experience: text('experience', { enum: ['beginner', 'intermediate', 'advanced'] }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const routines = pgTable('routines', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  week_start_date: date('week_start_date').notNull(),
  week_number: integer('week_number').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const routine_days = pgTable('routine_days', {
  id: serial('id').primaryKey(),
  routine_id: integer('routine_id').references(() => routines.id).notNull(),
  day_of_week: integer('day_of_week').notNull(), // 1=Mon, 2=Tue, ..., 6=Sat
  muscle_group: text('muscle_group', {
    enum: ['push', 'pull', 'legs', 'full_body', 'rest'],
  }).notNull(),
});

export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  routine_day_id: integer('routine_day_id').references(() => routine_days.id).notNull(),
  name: text('name').notNull(),
  sets: integer('sets').notNull(),
  reps: text('reps').notNull(),
  rest_seconds: integer('rest_seconds').notNull(),
  notes: text('notes'),
  icon_name: text('icon_name').notNull().default('dumbbell'),
  order: integer('order').notNull().default(0),
});

export const exercise_preferences = pgTable('exercise_preferences', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  disliked_exercise: text('disliked_exercise').notNull(),
  preferred_exercise: text('preferred_exercise').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Routine = typeof routines.$inferSelect;
export type NewRoutine = typeof routines.$inferInsert;
export type RoutineDay = typeof routine_days.$inferSelect;
export type NewRoutineDay = typeof routine_days.$inferInsert;
export type ExerciseRow = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
export type ExercisePreference = typeof exercise_preferences.$inferSelect;
export type NewExercisePreference = typeof exercise_preferences.$inferInsert;
