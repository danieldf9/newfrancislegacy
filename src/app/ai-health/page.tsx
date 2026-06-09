
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HeartPulse, Loader2, Utensils, ShoppingCart, Lightbulb, AlertTriangle, Sparkles, Dumbbell, Star, Trophy, Target, Clock, Armchair, Ban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLoader } from '@/context/loader-context';
import { HealthFitnessInputSchema, type HealthFitnessOutput } from '@/lib/schemas';
import type { z } from 'zod';
import { getHealthFitnessPlan } from '@/ai/flows/health-fitness-flow';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

type HealthFormValues = z.infer<typeof HealthFitnessInputSchema>;

const fitnessGoals = [
  { id: 'weight_loss', label: 'Weight Loss' },
  { id: 'muscle_gain', label: 'Muscle Gain' },
  { id: 'endurance', label: 'Endurance' },
  { id: 'strength', label: 'Strength' },
  { id: 'flexibility', label: 'Flexibility' },
] as const;

const workoutPreferences = [
    { id: 'gym', label: 'Gym' },
    { id: 'home', label: 'Home Bodyweight' },
    { id: 'running', label: 'Running/Cardio' },
    { id: 'yoga', label: 'Yoga/Pilates' },
] as const;


export default function AiHealthPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const [analysisResult, setAnalysisResult] = useState<HealthFitnessOutput | null>(null);

  const form = useForm<HealthFormValues>({
    resolver: zodResolver(HealthFitnessInputSchema),
    defaultValues: {
      age: 30,
      weightKg: 70,
      heightCm: 175,
      activityLevel: 'moderately-active',
      medicalHistory: 'None',
      dietaryPreferences: 'None',
      fitnessGoals: ["weight_loss"],
      availableEquipment: "Basic dumbbells and a yoga mat.",
      workoutPreferences: ["home"],
      injuriesLimitations: "None",
      experienceLevel: 'beginner',
    },
  });

  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'Please log in to access this page.' });
      router.push(`/login?redirect_to=${pathname}`);
    }
  }, [user, isAuthLoading, router, toast, pathname]);

  async function onSubmit(values: HealthFormValues) {
    setIsSubmitting(true);
    setAnalysisResult(null);
    showLoader();
    try {
      const result = await getHealthFitnessPlan(values);
      setAnalysisResult(result);
       toast({
        title: "Analysis Complete",
        description: "Your personalized health & fitness plan is ready!",
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
      hideLoader();
    }
  }

  if (isAuthLoading || !user) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Card className="w-full">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                <HeartPulse className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">AI Health & Fitness Planner</CardTitle>
            <CardDescription>Enter your details to generate a holistic health plan with nutrition and workout guidance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Step 1: Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="weightKg" render={({ field }) => (<FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="heightCm" render={({ field }) => (<FormItem><FormLabel>Height (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                   <FormField control={form.control} name="activityLevel" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Activity Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select your activity level" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                          <SelectItem value="lightly-active">Lightly Active (light exercise/sports 1-3 days/week)</SelectItem>
                          <SelectItem value="moderately-active">Moderately Active (moderate exercise/sports 3-5 days/week)</SelectItem>
                          <SelectItem value="very-active">Very Active (hard exercise/sports 6-7 days a week)</SelectItem>
                          <SelectItem value="extra-active">Extra Active (very hard exercise/sports & physical job)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              {/* Fitness Goals & Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Step 2: Fitness Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fitnessGoals"
                    render={() => (
                      <FormItem>
                        <FormLabel>What are your primary fitness goals? (Select up to 3)</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                          {fitnessGoals.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="fitnessGoals"
                              render={({ field }) => {
                                return (
                                  <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          const currentGoals = field.value || [];
                                          const newGoals = checked
                                            ? [...currentGoals, item.id]
                                            : currentGoals.filter((value) => value !== item.id);
                                          
                                          if (newGoals.length <= 3) {
                                            field.onChange(newGoals);
                                          } else {
                                            toast({ variant: 'destructive', title: 'Limit Reached', description: 'You can select up to 3 fitness goals.' });
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workoutPreferences"
                    render={() => (
                      <FormItem>
                        <FormLabel>What types of workouts do you prefer?</FormLabel>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                          {workoutPreferences.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="workoutPreferences"
                              render={({ field }) => {
                                return (
                                  <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="experienceLevel" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fitness Experience Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select your experience level" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner (New to structured exercise)</SelectItem>
                          <SelectItem value="intermediate">Intermediate (Consistent for 6-12 months)</SelectItem>
                          <SelectItem value="advanced">Advanced (Multiple years of experience)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              {/* Equipment & Health History */}
              <Card>
                <CardHeader>
                  <CardTitle>Step 3: Health & Equipment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="availableEquipment" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Available Equipment</FormLabel>
                          <FormControl><Textarea placeholder="e.g., Dumbbells, resistance bands, treadmill, or just bodyweight." {...field} /></FormControl>
                          <FormDescription>List any fitness equipment you have access to.</FormDescription>
                          <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="injuriesLimitations" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Injuries & Limitations</FormLabel>
                          <FormControl><Textarea placeholder="e.g., Bad knees, shoulder injury, or None." {...field} /></FormControl>
                          <FormDescription>Please list any current or past issues the AI should be aware of.</FormDescription>
                          <FormMessage />
                      </FormItem>
                  )} />
                   <FormField control={form.control} name="dietaryPreferences" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Dietary Preferences & Restrictions</FormLabel>
                          <FormControl><Textarea placeholder="e.g., Vegetarian, Gluten-free, Allergic to nuts" {...field} /></FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="medicalHistory" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Medical History</FormLabel>
                          <FormControl><Textarea placeholder="e.g., High blood pressure, Diabetes, None" {...field} /></FormControl>
                          <FormDescription>Please list any relevant medical conditions.</FormDescription>
                          <FormMessage />
                      </FormItem>
                  )} />
                </CardContent>
              </Card>


              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate My Plan</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {analysisResult && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="text-2xl">Your Personalized Health & Fitness Plan</CardTitle>
                <CardDescription>Here is the AI-generated plan based on your data. Estimated daily calories: {analysisResult.nutritionPlan.estimatedDailyCalories} kcal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Fitness Plan */}
                <section>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><Dumbbell className="h-5 w-5 text-primary" /> 4-Week Fitness Plan</h3>
                     <div className="space-y-6">
                        {analysisResult.fitnessPlan.weeklyPlan.map((week, index) => (
                            <Card key={index} className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle>Week {week.week}</CardTitle>
                                    <CardDescription>{week.focus}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {week.days.map(day => (
                                            <div key={day.day} className="p-3 border rounded-md">
                                                <p className="font-bold">Day {day.day}: {day.title}</p>
                                                <ul className="text-sm text-muted-foreground list-disc list-inside">
                                                    {day.exercises.map(ex => <li key={ex.name}>{ex.name} ({ex.sets}x{ex.reps})</li>)}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
                <Separator/>

                {/* Nutrition Plan */}
                <section>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><Utensils className="h-5 w-5 text-primary" /> Daily Meal Plan</h3>
                    <div className="space-y-6">
                        {analysisResult.nutritionPlan.mealPlan.map((meal, index) => (
                            <Card key={`${meal.dishName}-${index}`} className="bg-muted/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex justify-between">
                                        <span>{meal.mealType}</span>
                                        <span className="text-muted-foreground text-sm font-medium">~{meal.calories} kcal</span>
                                    </CardTitle>
                                    <CardDescription>{meal.dishName}</CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm">
                                    <p className="font-semibold">Ingredients:</p>
                                    <ul className="list-disc list-inside text-muted-foreground ml-4">
                                        {meal.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                    </ul>
                                     <p className="font-semibold mt-3">Instructions:</p>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{meal.instructions}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
                <Separator/>
                <div className="grid md:grid-cols-2 gap-8">
                    <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><ShoppingCart className="h-5 w-5 text-primary" /> Grocery List</h3>
                        <div className="space-y-4">
                        {analysisResult.nutritionPlan.groceryList.map(category => (
                            <div key={category.category}>
                                <h4 className="font-semibold">{category.category}</h4>
                                <ul className="list-disc list-inside text-muted-foreground ml-4">
                                    {category.items.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        ))}
                        </div>
                    </section>
                     <div className="space-y-6">
                        <section>
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><Lightbulb className="h-5 w-5 text-primary" /> AI Coach Recommendations</h3>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            {analysisResult.aiCoachRecommendations.map((advice, i) => <li key={i}>{advice}</li>)}
                            </ul>
                        </section>
                        <section>
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><Trophy className="h-5 w-5 text-yellow-500" /> Achievements to Unlock</h3>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            {analysisResult.gamificationSetup.achievements.map((ach, i) => <li key={i}><b>{ach.name}</b>: {ach.description}</li>)}
                            </ul>
                        </section>
                     </div>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
