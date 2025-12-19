// src/app/api/training/generate/route.ts
import { NextResponse } from 'next/server';
import { generateDailyWorkout } from '@/lib/trainingEngine/generateWorkout';

export async function POST(request: Request) {
  try {
    const { goal } = await request.json();
    
    if (!goal) {
        return NextResponse.json({ error: 'Goal is required' }, { status: 400 });
    }

    const workout = await generateDailyWorkout(goal);
    
    return NextResponse.json({ workout });
  } catch (error) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}