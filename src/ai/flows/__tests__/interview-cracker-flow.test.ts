
import { getInterviewPlan } from '../interview-cracker-flow';
import { ai } from '@/ai/genkit';
import type { InterviewCrackerInput } from '@/lib/schemas';

// Mock the AI module
jest.mock('@/ai/genkit', () => ({
  ai: {
    definePrompt: jest.fn(),
  },
}));

// A mock prompt function
const mockPrompt = jest.fn();

describe('Interview Cracker Flow', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (ai.definePrompt as jest.Mock).mockReturnValue(mockPrompt);
    mockPrompt.mockClear();
  });

  const validInput: InterviewCrackerInput = {
    jobRole: 'Frontend Developer',
    experienceLevel: 'mid',
    topics: ['React', 'TypeScript'],
  };

  it('should generate a structured interview plan for a valid request', async () => {
    const mockPlan = {
      plan: '## Your Frontend Interview Plan\n\n### React\n- Practice React Hooks.\n\n### TypeScript\n- Understand advanced types.',
    };
    mockPrompt.mockResolvedValue({ output: mockPlan });

    const result = await getInterviewPlan(validInput);

    expect(ai.definePrompt).toHaveBeenCalled();
    expect(mockPrompt).toHaveBeenCalledWith(validInput);
    expect(result).toEqual(mockPlan);
    expect(result.plan).toContain('Frontend Interview Plan');
  });

  it('should throw an error if the AI provides no output', async () => {
    mockPrompt.mockResolvedValue({ output: null });

    await expect(getInterviewPlan(validInput)).rejects.toThrow("The AI failed to generate an interview plan. Please try again.");
  });

  it('should propagate errors from the AI prompt function', async () => {
    const errorMessage = 'AI model service is down';
    mockPrompt.mockRejectedValue(new Error(errorMessage));

    await expect(getInterviewPlan(validInput)).rejects.toThrow(errorMessage);
  });
});
