import { NextResponse } from 'next/server';
import { db, initDB } from '@/lib/db';
import { routines, routine_days, exercises } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

const DEFAULT_USER_ID = 1;

export async function GET() {
  try {
    await initDB();

    const allRoutines = await db
      .select()
      .from(routines)
      .where(eq(routines.user_id, DEFAULT_USER_ID))
      .orderBy(desc(routines.created_at));

    const routinesWithDays = await Promise.all(
      allRoutines.map(async (routine) => {
        const days = await db
          .select()
          .from(routine_days)
          .where(eq(routine_days.routine_id, routine.id));

        const daysWithExercises = await Promise.all(
          days.map(async (day) => {
            const dayExercises = await db
              .select()
              .from(exercises)
              .where(eq(exercises.routine_day_id, day.id))
              .orderBy(exercises.order);
            return { ...day, exercises: dayExercises };
          })
        );

        return { ...routine, days: daysWithExercises };
      })
    );

    return NextResponse.json({ routines: routinesWithDays });
  } catch (error) {
    console.error('GET /api/history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
