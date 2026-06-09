
import { getHealthFitnessPlan } from '../health-fitness-flow';
import { ai } from '@/ai/genkit';
import type { HealthFitnessInput, HealthFitnessOutput } from '@/lib/schemas';

// Mock the AI module
jest.mock('@/ai/genkit', () => ({
  ai: {
    definePrompt: jest.fn(),
  },
}));

// A mock prompt function
const mockPrompt = jest.fn();

describe('Health & Fitness Flow', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (ai.definePrompt as jest.Mock).mockReturnValue(mockPrompt);
    mockPrompt.mockClear();
  });

  const validInput: HealthFitnessInput = {
    age: 28,
    weightKg: 75,
    heightCm: 180,
    activityLevel: 'moderately-active',
    fitnessGoals: ['muscle_gain', 'strength'],
    availableEquipment: 'Full gym access',
    workoutPreferences: ['gym'],
    experienceLevel: 'intermediate',
    medicalHistory: 'None',
    dietaryPreferences: 'High protein',
    injuriesLimitations: 'None',
  };

  const mockPlan: HealthFitnessOutput = {
    nutritionPlan: {
      estimatedDailyCalories: 2800,
      mealPlan: [
        {
          mealType: "Breakfast",
          dishName: "Oatmeal with Protein Powder",
          ingredients: ["Oats", "Whey Protein", "Berries"],
          instructions: "Cook oats and mix in protein powder.",
          calories: 500,
        },
      ],
      groceryList: [{ category: "Grains", items: ["Oats"] }],
    },
    fitnessPlan: {
      weeklyPlan: [
        {
          week: 1,
          focus: "Foundation Building",
          days: [
            {
              day: 1,
              title: "Full Body Strength A",
              exercises: [{ name: "Squats", sets: "3", reps: "8-10" }],
            },
          ],
        },
      ],
    },
    progressTracking: {
      metrics: ["Body Weight (weekly)", "Bench Press 1RM"],
    },
    gamificationSetup: {
      achievements: [{ name: "First Week Done!", description: "Completed all workouts in your first week." }],
    },
    aiCoachRecommendations: ["Focus on progressive overload."],
  };

  it('should generate a personalized health and fitness plan for a valid request', async () => {
    mockPrompt.mockResolvedValue({ output: mockPlan });

    const result = await getHealthFitnessPlan(validInput);

    expect(ai.definePrompt).toHaveBeenCalled();
    expect(mockPrompt).toHaveBeenCalledWith(validInput);
    expect(result).toEqual(mockPlan);
    expect(result.fitnessPlan.weeklyPlan.length).toBe(1);
    expect(result.nutritionPlan.estimatedDailyCalories).toBe(2800);
  });

  it('should throw an error if the AI provides no output', async () => {
    mockPrompt.mockResolvedValue({ output: null });

    await expect(getHealthFitnessPlan(validInput)).rejects.toThrow("The AI failed to generate a health and fitness plan. Please try adjusting your inputs.");
  });

  it('should propagate errors from the AI prompt function', async () => {
    const errorMessage = 'AI model service is unavailable';
    mockPrompt.mockRejectedValue(new Error(errorMessage));

    await expect(getHealthFitnessPlan(validInput)).rejects.toThrow(errorMessage);
  });
});
