// src/app/onboarding/page.tsx
import { redirect } from 'next/navigation';

// Redirige siempre al primer paso del onboarding
export default function OnboardingIndexPage() {
  redirect('/onboarding/step-1-biometrics');
}