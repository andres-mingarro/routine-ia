import { NextRequest, NextResponse } from 'next/server';
import { db, initDB } from '@/lib/db';
import { exercises, exercise_preferences } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getExerciseIcon } from '@/lib/exercises';

export async function POST(req: NextRequest) {
  try {
    await initDB();

    const body = await req.json();
    const { exercise_id, new_name, disliked_name, user_id } = body as {
      exercise_id: number;
      new_name: string;
      disliked_name: string;
      user_id: number;
    };

    if (!exercise_id || !new_name || !disliked_name || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields: exercise_id, new_name, disliked_name, user_id' },
        { status: 400 }
      );
    }

    const iconInfo = getExerciseIcon(new_name);

    const updated = await db
      .update(exercises)
      .set({ name: new_name, icon_name: iconInfo.category })
      .where(eq(exercises.id, exercise_id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    await db.insert(exercise_preferences).values({
      user_id,
      disliked_exercise: disliked_name,
      preferred_exercise: new_name,
    });

    return NextResponse.json({ success: true, exercise: updated[0] });
  } catch (error) {
    console.error('POST /api/replace-exercise error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to replace exercise: ${message}` },
      { status: 500 }
    );
  }
}
