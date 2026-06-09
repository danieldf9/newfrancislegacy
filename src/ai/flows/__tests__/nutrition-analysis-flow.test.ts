
import { getNutritionPlan } from '../nutrition-analysis-flow';
import { ai } from '@/ai/genkit';
import type { NutritionAnalysisInput, NutritionAnalysisOutput } from '@/lib/schemas';

// Mock the AI module
jest.mock('@/ai/genkit', () => ({
  ai: {
    definePrompt: jest.fn(),
  },
}));

// A mock prompt function
const mockPrompt = jest.fn();

describe('Nutrition Analysis Flow', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (ai.definePrompt as jest.Mock).mockReturnValue(mockPrompt);
    mockPrompt.mockClear();
  });

  const validInput: NutritionAnalysisInput = {
    age: 35,
    weightKg: 80,
    heightCm: 175,
    activityLevel: 'lightly-active',
    medicalHistory: 'None',
    dietaryPreferences: 'Lactose intolerant',
  };

  const mockPlan: NutritionAnalysisOutput = {
    mealPlan: {
      estimatedDailyCalories: 2200,
      meals: [
        {
          mealType: 'Breakfast',
          dishName: 'Oatmeal with Almond Milk',
          ingredients: ['Oats', 'Almond Milk', 'Banana'],
          instructions: 'Cook oats with almond milk and top with banana slices.',
          calories: 450,
        },
      ],
    },
    groceryList: [{ category: 'Grains', items: ['Oats'] }],
    dietaryAdvice: ['Avoid dairy products.', 'Ensure adequate calcium from other sources like leafy greens.'],
    allergyAlerts: ['Lactose Intolerance'],
  };

  it('should generate a personalized nutrition plan for a valid request', async () => {
    mockPrompt.mockResolvedValue({ output: mockPlan });

    const result = await getNutritionPlan(validInput);

    expect(ai.definePrompt).toHaveBeenCalled();
    expect(mockPrompt).toHaveBeenCalledWith(validInput);
    expect(result).toEqual(mockPlan);
    expect(result.mealPlan.meals.length).toBe(1);
    expect(result.mealPlan.estimatedDailyCalories).toBe(2200);
  });

  it('should throw an error if the AI provides no output', async () => {
    mockPrompt.mockResolvedValue({ output: null });

    await expect(getNutritionPlan(validInput)).rejects.toThrow("The AI failed to generate a nutrition plan. Please try adjusting your inputs.");
  });

  it('should propagate errors from the AI prompt function', async () => {
    const errorMessage = 'AI model service is unavailable';
    mockPrompt.mockRejectedValue(new Error(errorMessage));

    await expect(getNutritionPlan(validInput)).rejects.toThrow(errorMessage);
  });
});
