// src/app/api/training/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateDailyWorkout } from '@/lib/trainingEngine/generateWorkout';
import { withAIRateLimit } from '@/lib/lib_rate-limiter';

async function handlePOST(request: NextRequest) {
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

// Apply AI rate limiting: 10 requests per hour
export const POST = withAIRateLimit(handlePOST);