
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Sparkles, Dumbbell, Flame, Snowflake, Clock, Zap, Shield, Armchair, SlidersHorizontal } from 'lucide-react';
import { useLoader } from '@/context/loader-context';
import { getDailyWorkout } from '@/ai/flows/daily-workout-flow';
import type { DailyWorkoutInput, DailyWorkoutOutput } from '@/lib/schemas';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DailyWorkoutInputSchema } from '@/lib/schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const workoutPreferences = [
    { id: 'strength', label: 'Strength' },
    { id: 'hiit', label: 'HIIT' },
    { id: 'yoga', label: 'Yoga/Pilates' },
    { id: 'cardio', label: 'Cardio' },
    { id: 'recovery', label: 'Active Recovery' },
] as const;

type DailyWorkoutFormValues = z.infer<typeof DailyWorkoutInputSchema>;

export default function DailyWorkoutPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const [workout, setWorkout] = useState<DailyWorkoutOutput | null>(null);

  const form = useForm<DailyWorkoutFormValues>({
    resolver: zodResolver(DailyWorkoutInputSchema),
    defaultValues: {
      fitnessGoals: ['strength', 'muscle_gain'], // Assuming these are from user's main profile
      experienceLevel: 'intermediate', // Assuming from user's main profile
      workoutPreference: "strength",
      targetMuscleGroups: "Full Body",
      workoutDuration: "45-60 minutes",
      availableEquipment: 'Dumbbells, pull-up bar, resistance bands',
    },
  });


  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'Please log in to access this page.' });
      router.push(`/login?redirect_to=${pathname}`);
    }
  }, [user, isAuthLoading, router, toast, pathname]);

  async function handleGenerateWorkout(values: DailyWorkoutFormValues) {
    setIsGenerating(true);
    setWorkout(null);
    showLoader();
    try {
      const result = await getDailyWorkout(values);
      setWorkout(result);
      toast({
        title: "Workout Ready!",
        description: "Your personalized daily workout has been generated.",
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsGenerating(false);
      hideLoader();
    }
  }
  
  const getPhaseIcon = (phaseName: string) => {
    switch (phaseName) {
      case "Warm-up": return <Flame className="h-6 w-6 text-orange-500" />;
      case "Main Workout": return <Dumbbell className="h-6 w-6 text-primary" />;
      case "Cool-down": return <Snowflake className="h-6 w-6 text-blue-400" />;
      default: return <Dumbbell className="h-6 w-6" />;
    }
  };

  if (isAuthLoading || !user) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <Dumbbell className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">On-Demand Workout Generator</CardTitle>
          <CardDescription>Get a complete, AI-generated workout session tailored to your needs for today.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateWorkout)} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                     <FormField control={form.control} name="workoutPreference" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Workout Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {workoutPreferences.map(item => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="targetMuscleGroups" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Muscle Group Focus</FormLabel>
                        <FormControl><Input placeholder="e.g., Full Body, Upper Body" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="workoutDuration" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Desired Duration</FormLabel>
                        <FormControl><Input placeholder="e.g., 30 minutes, 1 hour" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="availableEquipment" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Equipment Available Today</FormLabel>
                        <FormControl><Textarea placeholder="e.g., Bodyweight only, Dumbbells, Full Gym" {...field} rows={2}/></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                 <Button size="lg" type="submit" className="w-full" disabled={isGenerating}>
                    {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Your Workout...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate My Workout</>}
                </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {workout && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">{workout.workoutTitle}</CardTitle>
            <CardDescription className="flex items-center gap-4 pt-1">
                <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-yellow-400"/> {workout.workoutType}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{workout.estimatedDuration}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {workout.phases.map((phase, phaseIndex) => (
                <div key={phaseIndex}>
                    <h3 className="text-xl font-bold flex items-center gap-3 mb-4">
                        {getPhaseIcon(phase.phaseName)}
                        {phase.phaseName}
                    </h3>
                    <div className="space-y-4">
                        {phase.exercises.map((exercise, exIndex) => (
                            <Card key={exIndex} className="bg-muted/50 p-4">
                                <h4 className="font-semibold">{exercise.name}</h4>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                    {exercise.sets && exercise.reps && <span>Sets/Reps: <strong>{exercise.sets}x{exercise.reps}</strong></span>}
                                    {exercise.duration && <span>Duration: <strong>{exercise.duration}</strong></span>}
                                    {exercise.rest && <span>Rest: <strong>{exercise.rest}</strong></span>}
                                </div>
                                {exercise.notes && <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-muted"><em>{exercise.notes}</em></p>}
                            </Card>
                        ))}
                    </div>
                     {phaseIndex < workout.phases.length - 1 && <Separator className="mt-8"/>}
                </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
