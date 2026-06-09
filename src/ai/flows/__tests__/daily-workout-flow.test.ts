
import { getDailyWorkout } from '../daily-workout-flow';
import { ai } from '@/ai/genkit';
import type { DailyWorkoutInput, DailyWorkoutOutput } from '@/lib/schemas';

// Mock the AI module
jest.mock('@/ai/genkit', () => ({
  ai: {
    definePrompt: jest.fn(),
  },
}));

// A mock prompt function
const mockPrompt = jest.fn();

describe('Daily Workout Flow', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (ai.definePrompt as jest.Mock).mockReturnValue(mockPrompt);
    mockPrompt.mockClear();
  });

  it('should generate a structured workout plan for a valid request', async () => {
    const mockWorkout: DailyWorkoutOutput = {
        workoutTitle: "Full Body Strength & Conditioning",
        workoutType: "Strength Training",
        estimatedDuration: "Approx. 45 minutes",
        phases: [
            {
                phaseName: "Warm-up",
                exercises: [{ name: "Jumping Jacks", duration: "60 seconds" }]
            },
            {
                phaseName: "Main Workout",
                exercises: [{ name: "Dumbbell Squats", sets: "3", reps: "10-12", rest: "60 seconds" }]
            },
            {
                phaseName: "Cool-down",
                exercises: [{ name: "Quad Stretch", duration: "Hold for 30 seconds" }]
            }
        ]
    };
    mockPrompt.mockResolvedValue({ output: mockWorkout });

    const input: DailyWorkoutInput = {
        fitnessGoals: ['strength'],
        experienceLevel: 'intermediate',
        workoutPreference: 'strength',
        targetMuscleGroups: 'Full Body',
        workoutDuration: '45 minutes',
        availableEquipment: 'Dumbbells',
    };

    const result = await getDailyWorkout(input);

    expect(ai.definePrompt).toHaveBeenCalled();
    expect(mockPrompt).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockWorkout);
    expect(result.phases.length).toBe(3);
    expect(result.phases[0].phaseName).toBe("Warm-up");
  });

  it('should throw an error if the AI provides no output', async () => {
    mockPrompt.mockResolvedValue({ output: null });

    const input: DailyWorkoutInput = {
        fitnessGoals: ['strength'],
        experienceLevel: 'intermediate',
        workoutPreference: 'strength',
        targetMuscleGroups: 'Full Body',
        workoutDuration: '45 minutes',
        availableEquipment: 'Dumbbells',
    };

    await expect(getDailyWorkout(input)).rejects.toThrow("The AI failed to generate a daily workout. Please try again.");
  });

  it('should propagate errors from the AI prompt function', async () => {
    const errorMessage = 'AI model service is down';
    mockPrompt.mockRejectedValue(new Error(errorMessage));

    const input: DailyWorkoutInput = {
        fitnessGoals: ['strength'],
        experienceLevel: 'intermediate',
        workoutPreference: 'strength',
        targetMuscleGroups: 'Full Body',
        workoutDuration: '45 minutes',
        availableEquipment: 'Dumbbells',
    };

    await expect(getDailyWorkout(input)).rejects.toThrow(errorMessage);
  });
});
