import { ExperienceLevel, AIRoutineResponse, AIRoutineDay } from '@/types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

interface UserProfile {
  weight: number;
  height: number;
  experience: ExperienceLevel;
}

interface PreviousExercise {
  name: string;
  week: number;
}

interface ExercisePreference {
  disliked: string;
  preferred: string;
}

export async function generateWeeklyRoutine(
  user: UserProfile,
  previousExercises: PreviousExercise[],
  preferences: ExercisePreference[] = []
): Promise<AIRoutineResponse> {
  const bmi = (user.weight / ((user.height / 100) * (user.height / 100))).toFixed(1);

  const prevExerciseList =
    previousExercises.length > 0
      ? previousExercises.map((e) => `- ${e.name} (week ${e.week} ago)`).join('\n')
      : 'None yet (first routine)';

  const preferenceSection =
    preferences.length > 0
      ? `USER EXERCISE PREFERENCES (based on past replacements — follow these strictly):\n${preferences
          .map((p) => `- Instead of "${p.disliked}", use "${p.preferred}"`)
          .join('\n')}`
      : '';

  const prompt = `You are a professional personal trainer creating a gym routine. Generate a complete 6-day weekly training program. All exercise names and notes must be written in Spanish.

USER PROFILE:
- Weight: ${user.weight} kg
- Height: ${user.height} cm
- BMI: ${bmi}
- Experience Level: ${user.experience}

PREVIOUS EXERCISES (avoid repeating these to ensure variety):
${prevExerciseList}
${preferenceSection ? `\n${preferenceSection}\n` : ''}
TRAINING SPLIT:
- Day 1 (Monday): Push - Chest, Shoulders, Triceps
- Day 2 (Tuesday): Pull - Back, Biceps
- Day 3 (Wednesday): Legs - Quads, Hamstrings, Glutes, Calves
- Day 4 (Thursday): Push - Chest, Shoulders, Triceps (different exercises)
- Day 5 (Friday): Pull - Back, Biceps (different exercises)
- Day 6 (Saturday): Full Body - Compound movements

GUIDELINES:
- For ${user.experience} level: ${getExperienceGuidelines(user.experience)}
- Include 4-6 exercises per day
- Vary rep ranges (strength: 3-5, hypertrophy: 8-12, endurance: 15-20)
- Include appropriate rest times
- Add brief technique notes for complex movements
- Choose exercises that complement each other within each day
- Avoid the previously used exercises listed above

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "days": [
    {
      "day_of_week": 1,
      "muscle_group": "push",
      "exercises": [
        {
          "name": "Press de Banca",
          "sets": 4,
          "reps": "8-10",
          "rest_seconds": 90,
          "notes": "Mantené los omóplatos retraídos",
          "icon_name": "bench-press"
        }
      ]
    }
  ]
}

The muscle_group values must be exactly: "push", "pull", "legs", "full_body"
Day numbers: 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday`;

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  let jsonText: string = data.choices?.[0]?.message?.content ?? '';

  if (!jsonText) throw new Error('Empty response from Groq');

  // Remove markdown code blocks if present
  if (jsonText.includes('```')) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const parsed = JSON.parse(jsonText.trim()) as AIRoutineResponse;

  if (!parsed.days || !Array.isArray(parsed.days)) {
    throw new Error('Invalid routine structure from AI');
  }

  const dayNumbers = parsed.days.map((d: AIRoutineDay) => d.day_of_week);
  for (let i = 1; i <= 6; i++) {
    if (!dayNumbers.includes(i as 1 | 2 | 3 | 4 | 5 | 6)) {
      throw new Error(`Missing day ${i} in AI response`);
    }
  }

  return parsed;
}

function getExperienceGuidelines(experience: ExperienceLevel): string {
  switch (experience) {
    case 'beginner':
      return 'Focus on compound movements, 3 sets per exercise, moderate weight, master form first. Use 60-90 sec rest. 3-4 exercises per day.';
    case 'intermediate':
      return 'Mix of compound and isolation exercises, 3-4 sets, progressive overload, 4-5 exercises per day. Use 60-120 sec rest.';
    case 'advanced':
      return 'Complex programming with supersets, drop sets, and advanced techniques. 4-5 sets per exercise, 5-6 exercises per day. Varied rest periods.';
  }
}
