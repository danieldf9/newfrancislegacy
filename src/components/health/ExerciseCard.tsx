
'use client';

import type { Exercise } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Dumbbell } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const getDifficultyVariant = (difficulty: Exercise['difficulty']) => {
    switch (difficulty) {
      case 'Beginner':
        return 'secondary';
      case 'Intermediate':
        return 'default';
      case 'Advanced':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="flex flex-col group overflow-hidden">
      <CardHeader>
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          {exercise.imageUrl ? (
            <Image
              src={exercise.imageUrl}
              alt={exercise.name}
              fill={true}
              style={{objectFit: 'cover'}}
              className="group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={exercise.imageHint || 'exercise fitness'}
            />
          ) : (
             <div className="flex items-center justify-center h-full bg-muted">
                <Dumbbell className="h-12 w-12 text-muted-foreground" />
             </div>
          )}
        </div>
        <CardTitle className="mt-4">{exercise.name}</CardTitle>
        <CardDescription as="div">
            <Badge variant="outline">{exercise.muscleGroup}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          {exercise.instructions.slice(0, 3).map((step, i) => (
            <li key={i}>{step}</li>
          ))}
          {exercise.instructions.length > 3 && <li>...and more</li>}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant={getDifficultyVariant(exercise.difficulty)}>{exercise.difficulty}</Badge>
        <Badge variant="secondary">{exercise.equipment}</Badge>
      </CardFooter>
    </Card>
  );
}
