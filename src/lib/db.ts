import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

export async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        weight REAL NOT NULL,
        height REAL NOT NULL,
        experience TEXT NOT NULL CHECK (experience IN ('beginner', 'intermediate', 'advanced')),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS routines (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        week_start_date DATE NOT NULL,
        week_number INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS routine_days (
        id SERIAL PRIMARY KEY,
        routine_id INTEGER REFERENCES routines(id) NOT NULL,
        day_of_week INTEGER NOT NULL,
        muscle_group TEXT NOT NULL CHECK (muscle_group IN ('push', 'pull', 'legs', 'full_body', 'rest'))
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS exercises (
        id SERIAL PRIMARY KEY,
        routine_day_id INTEGER REFERENCES routine_days(id) NOT NULL,
        name TEXT NOT NULL,
        sets INTEGER NOT NULL,
        reps TEXT NOT NULL,
        rest_seconds INTEGER NOT NULL,
        notes TEXT,
        icon_name TEXT NOT NULL DEFAULT 'dumbbell',
        "order" INTEGER NOT NULL DEFAULT 0
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS exercise_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        disliked_exercise TEXT NOT NULL,
        preferred_exercise TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
