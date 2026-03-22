import { NextResponse } from 'next/server';
import { db, initDB } from '@/lib/db';
import { users, routines, routine_days, exercises, exercise_preferences } from '@/lib/schema';
import { eq, desc, gte } from 'drizzle-orm';
import { generateWeeklyRoutine } from '@/lib/ai';

const DEFAULT_USER_ID = 1;

function getWeekStartDate(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

function getWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek) + 1;
}

export async function GET() {
  try {
    await initDB();

    // Get current routine for the week
    const weekStart = getWeekStartDate();
    const currentRoutines = await db
      .select()
      .from(routines)
      .where(eq(routines.user_id, DEFAULT_USER_ID))
      .orderBy(desc(routines.created_at))
      .limit(1);

    if (currentRoutines.length === 0) {
      return NextResponse.json({ routine: null });
    }

    const routine = currentRoutines[0];
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

    return NextResponse.json({
      routine: { ...routine, days: daysWithExercises },
    });
  } catch (error) {
    console.error('GET /api/generate-routine error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch routine' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    await initDB();

    // Fetch user
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.id, DEFAULT_USER_ID))
      .limit(1);

    if (userList.length === 0) {
      return NextResponse.json(
        { error: 'User not configured. Please set up your profile first.' },
        { status: 400 }
      );
    }

    const user = userList[0];

    // Fetch last 2 weeks of routines to avoid exercise repetition
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const twoWeeksAgoStr = twoWeeksAgo.toISOString().split('T')[0];

    const pastRoutines = await db
      .select()
      .from(routines)
      .where(eq(routines.user_id, DEFAULT_USER_ID))
      .orderBy(desc(routines.created_at))
      .limit(2);

    const previousExercises: { name: string; week: number }[] = [];

    for (let i = 0; i < pastRoutines.length; i++) {
      const routine = pastRoutines[i];
      const days = await db
        .select()
        .from(routine_days)
        .where(eq(routine_days.routine_id, routine.id));

      for (const day of days) {
        const dayExercises = await db
          .select()
          .from(exercises)
          .where(eq(exercises.routine_day_id, day.id));

        for (const exercise of dayExercises) {
          previousExercises.push({
            name: exercise.name,
            week: i + 1,
          });
        }
      }
    }

    // Fetch exercise preferences for this user
    const userPreferences = await db
      .select()
      .from(exercise_preferences)
      .where(eq(exercise_preferences.user_id, DEFAULT_USER_ID));

    const preferences = userPreferences.map((p) => ({
      disliked: p.disliked_exercise,
      preferred: p.preferred_exercise,
    }));

    // Generate routine with Claude AI
    const aiRoutine = await generateWeeklyRoutine(
      {
        weight: user.weight,
        height: user.height,
        experience: user.experience as 'beginner' | 'intermediate' | 'advanced',
      },
      previousExercises,
      preferences
    );

    // Save routine to database
    const weekStart = getWeekStartDate();
    const weekNumber = getWeekNumber();

    const newRoutine = await db
      .insert(routines)
      .values({
        user_id: DEFAULT_USER_ID,
        week_start_date: weekStart,
        week_number: weekNumber,
      })
      .returning();

    const routine = newRoutine[0];

    // Save days and exercises
    const savedDays = [];
    for (const aiDay of aiRoutine.days) {
      const newDay = await db
        .insert(routine_days)
        .values({
          routine_id: routine.id,
          day_of_week: aiDay.day_of_week,
          muscle_group: aiDay.muscle_group,
        })
        .returning();

      const day = newDay[0];

      const savedExercises = [];
      for (let i = 0; i < aiDay.exercises.length; i++) {
        const aiExercise = aiDay.exercises[i];
        const newExercise = await db
          .insert(exercises)
          .values({
            routine_day_id: day.id,
            name: aiExercise.name,
            sets: aiExercise.sets,
            reps: aiExercise.reps,
            rest_seconds: aiExercise.rest_seconds,
            notes: aiExercise.notes || null,
            icon_name: aiExercise.icon_name,
            order: i,
          })
          .returning();
        savedExercises.push(newExercise[0]);
      }

      savedDays.push({ ...day, exercises: savedExercises });
    }

    return NextResponse.json({
      success: true,
      routine: { ...routine, days: savedDays },
    });
  } catch (error) {
    console.error('POST /api/generate-routine error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to generate routine: ${message}` },
      { status: 500 }
    );
  }
}
