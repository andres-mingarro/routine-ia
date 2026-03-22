import { redirect } from 'next/navigation';
import { db, initDB } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export default async function HomePage() {
  try {
    await initDB();
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.id, 1))
      .limit(1);

    if (userList.length === 0) {
      redirect('/setup');
    } else {
      redirect('/routine');
    }
  } catch {
    redirect('/setup');
  }
}
