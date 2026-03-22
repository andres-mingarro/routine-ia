import { NextRequest, NextResponse } from 'next/server';
import { db, initDB } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

const DEFAULT_USER_ID = 1;

export async function GET() {
  try {
    await initDB();
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.id, DEFAULT_USER_ID))
      .limit(1);

    if (userList.length === 0) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: userList[0] });
  } catch (error) {
    console.error('GET /api/user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDB();
    const body = await req.json();
    const { weight, height, experience } = body;

    if (!weight || !height || !experience) {
      return NextResponse.json(
        { error: 'Missing required fields: weight, height, experience' },
        { status: 400 }
      );
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(experience)) {
      return NextResponse.json(
        { error: 'Invalid experience level' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, DEFAULT_USER_ID))
      .limit(1);

    let user;
    if (existingUser.length > 0) {
      // Update existing user
      const updated = await db
        .update(users)
        .set({
          weight: parseFloat(weight),
          height: parseFloat(height),
          experience,
          updated_at: new Date(),
        })
        .where(eq(users.id, DEFAULT_USER_ID))
        .returning();
      user = updated[0];
    } else {
      // Create new user
      const created = await db
        .insert(users)
        .values({
          weight: parseFloat(weight),
          height: parseFloat(height),
          experience,
        })
        .returning();
      user = created[0];
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('POST /api/user error:', error);
    return NextResponse.json(
      { error: 'Failed to save user' },
      { status: 500 }
    );
  }
}
