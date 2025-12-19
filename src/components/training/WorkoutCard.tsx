// src/components/training/WorkoutCard.tsx
import React from 'react';
import { Workout } from '@/types/training';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Clock, Trophy, BarChart } from 'lucide-react';

interface WorkoutCardProps {
  workout: Workout;
  onStart?: () => void;
  showActions?: boolean;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onStart, showActions = true }) => {
  return (
    <Card className="w-full hover:shadow-md transition-all border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="text-xl">{workout.title}</CardTitle>
            {workout.isCompleted && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Completado</span>}
        </div>
        <CardDescription>{workout.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{workout.durationMinutes} min</span>
            </div>
            <div className="flex items-center gap-1">
                <BarChart size={16} />
                <span>{workout.difficulty}</span>
            </div>
            <div className="flex items-center gap-1">
                <Trophy size={16} />
                <span>{workout.exercises.length} Ejercicios</span>
            </div>
        </div>
      </CardContent>
      {showActions && !workout.isCompleted && (
        <CardFooter>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={onStart}>
                Comenzar Rutina
            </Button>
        </CardFooter>
      )}
    </Card>
  );
};