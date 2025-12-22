
interface PhasesDistribution {
  base: number;
  build: number;
  peak: number;
  taper: number;
  recovery: number;
}

export function determinePhaseForWeek(
  weekNumber: number,
  phases: PhasesDistribution
): "base" | "build" | "peak" | "taper" | "recovery" {
  let currentWeek = 0;
  
  // Base phase
  currentWeek += phases.base;
  if (weekNumber <= currentWeek) return "base";
  
  // Build phase
  currentWeek += phases.build;
  if (weekNumber <= currentWeek) return "build";
  
  // Peak phase
  currentWeek += phases.peak;
  if (weekNumber <= currentWeek) return "peak";
  
  // Taper phase
  currentWeek += phases.taper;
  if (weekNumber <= currentWeek) return "taper";
  
  // Recovery phase
  return "recovery";
}