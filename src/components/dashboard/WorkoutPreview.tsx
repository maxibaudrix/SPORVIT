// src/components/dashboard/WorkoutPreview.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Dumbbell, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface WorkoutPreviewProps {
  workoutName?: string;
  duration?: number;
  exerciseCount?: number;
  isCompleted?: boolean;
}

export const WorkoutPreview: React.FC<WorkoutPreviewProps> = ({ 
    workoutName, 
    duration, 
    exerciseCount,
    isCompleted = false 
}) => {
  const router = useRouter();

  if (isCompleted) {
      return (
        <Card className="bg-green-50 border-green-200 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <CheckCircle2 size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-green-900">¡Entrenamiento Completado!</h3>
                    <p className="text-sm text-green-700">Gran trabajo hoy. A descansar.</p>
                </div>
            </CardContent>
        </Card>
      );
  }

  return (
    <Card className="shadow-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full -mr-10 -mt-10" />
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Dumbbell className="text-blue-600" size={20} />
            Tu Entrenamiento
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {workoutName ? (
            <>
                <h4 className="text-xl font-semibold mb-1">{workoutName}</h4>
                <p className="text-gray-500 text-sm mb-4">{duration} min • {exerciseCount} Ejercicios</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/training/today')}>
                    Comenzar Ahora <ChevronRight size={16} className="ml-1" />
                </Button>
            </>
        ) : (
            <div className="text-center py-4">
                <p className="text-gray-500 mb-4">No hay rutina generada para hoy.</p>
                <Button variant="outline" onClick={() => router.push('/training/today')}>Generar Rutina</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
};