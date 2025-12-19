export function calculateBMR(
  weight: number, 
  height: number, 
  age: number, 
  gender: 'male' | 'female'
): number {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}