// src/components/training/ExerciseList.tsx
import React from 'react';
import { WorkoutExercise } from '@/types/training';

interface ExerciseListProps {
  exercises: WorkoutExercise[];
}

export const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  return (
    <div className="space-y-4">
      {exercises.map((exercise, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full font-bold text-gray-600">
                    {index + 1}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                    <p className="text-xs text-gray-500">{exercise.muscleGroup}</p>
                </div>
            </div>
            <div className="text-right">
                <div className="font-mono text-lg font-bold text-blue-600">
                    {exercise.targetSets} x {exercise.targetReps}
                </div>
                {exercise.restSeconds > 0 && (
                    <p className="text-xs text-gray-400">Descanso: {exercise.restSeconds}s</p>
                )}
            </div>
        </div>
      ))}
    </div>
  );
};