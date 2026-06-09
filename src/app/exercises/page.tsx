
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, Dumbbell, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sampleExercises } from '@/lib/exercise-database';
import type { Exercise } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExerciseCard } from '@/components/health/ExerciseCard';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ExerciseLibraryPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{ muscleGroup: string[]; equipment: string[] }>({
    muscleGroup: [],
    equipment: [],
  });

  const muscleGroups = [...new Set(sampleExercises.map(ex => ex.muscleGroup))];
  const equipmentTypes = [...new Set(sampleExercises.map(ex => ex.equipment))];

  const filteredExercises = sampleExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = filters.muscleGroup.length === 0 || filters.muscleGroup.includes(exercise.muscleGroup);
    const matchesEquipment = filters.equipment.length === 0 || filters.equipment.includes(exercise.equipment);
    return matchesSearch && matchesMuscleGroup && matchesEquipment;
  });

  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'Please log in to access this page.' });
      router.push(`/login?redirect_to=${pathname}`);
    }
  }, [user, isAuthLoading, router, toast, pathname]);

  if (isAuthLoading || !user) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl py-12">
      <div className="space-y-4 text-center mb-12">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <Dumbbell className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Exercise Library</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Browse our collection of exercises to build your perfect workout.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-20 bg-background/80 backdrop-blur-sm p-4 rounded-lg border z-10">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto"><Filter className="mr-2 h-4 w-4" /> Muscle Group</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Filter by Muscle Group</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {muscleGroups.map(group => (
                        <DropdownMenuCheckboxItem
                            key={group}
                            checked={filters.muscleGroup.includes(group)}
                            onCheckedChange={() => {
                                setFilters(prev => ({
                                    ...prev,
                                    muscleGroup: prev.muscleGroup.includes(group)
                                        ? prev.muscleGroup.filter(mg => mg !== group)
                                        : [...prev.muscleGroup, group]
                                }))
                            }}
                        >
                            {group}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto"><Filter className="mr-2 h-4 w-4" /> Equipment</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Filter by Equipment</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     {equipmentTypes.map(equip => (
                        <DropdownMenuCheckboxItem
                            key={equip}
                            checked={filters.equipment.includes(equip)}
                            onCheckedChange={() => {
                                setFilters(prev => ({
                                    ...prev,
                                    equipment: prev.equipment.includes(equip)
                                        ? prev.equipment.filter(e => e !== equip)
                                        : [...prev.equipment, equip]
                                }))
                            }}
                        >
                            {equip}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredExercises.map(exercise => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
      {filteredExercises.length === 0 && (
        <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No exercises match your search or filters.</p>
        </div>
      )}
    </div>
  );
}
