
import { getMockInterviewResponse } from '../mock-interview-flow';
import { ai } from '@/ai/genkit';
import type { MockInterviewState, MockInterviewOutput } from '@/lib/schemas';

// Mock the AI module
jest.mock('@/ai/genkit', () => ({
  ai: {
    definePrompt: jest.fn(),
  },
}));

// A mock prompt function
const mockPrompt = jest.fn();

describe('Mock Interview Flow', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (ai.definePrompt as jest.Mock).mockReturnValue(mockPrompt);
    mockPrompt.mockClear();
  });

  const baseInput: Omit<MockInterviewState, 'history'> = {
    jobRole: 'Software Engineer',
    experienceLevel: 'mid',
    topics: ['React', 'Node.js'],
  };

  it('should ask the first question when history is empty', async () => {
    const mockResponse: MockInterviewOutput = {
      question: 'Hello! Thanks for coming in. Let\'s start with a classic: Tell me about yourself.',
    };
    mockPrompt.mockResolvedValue({ output: mockResponse });

    const input: MockInterviewState = { ...baseInput, history: [] };
    const result = await getMockInterviewResponse(input);

    expect(ai.definePrompt).toHaveBeenCalled();
    expect(mockPrompt).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockResponse);
    expect(result.feedback).toBeUndefined();
  });

  it('should provide feedback and ask a new question after a user response', async () => {
    const mockResponse: MockInterviewOutput = {
      feedback: 'That\'s a good summary of your recent project. You clearly explained the tech stack.',
      question: 'Can you now tell me about a time you had a conflict with a coworker and how you resolved it?',
    };
    mockPrompt.mockResolvedValue({ output: mockResponse });

    const input: MockInterviewState = {
      ...baseInput,
      history: [
        { role: 'assistant', content: 'Tell me about a recent challenging project.' },
        { role: 'user', content: 'I worked on a project to migrate our monolith to microservices...' },
      ],
    };

    const result = await getMockInterviewResponse(input);

    expect(mockPrompt).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockResponse);
    expect(result.feedback).toBeDefined();
    expect(result.question).toBeDefined();
  });

  it('should throw an error if the AI provides no output', async () => {
    mockPrompt.mockResolvedValue({ output: null });

    const input: MockInterviewState = {
        ...baseInput,
        history: [{ role: 'assistant', content: 'What is your greatest weakness?' }]
    };

    await expect(getMockInterviewResponse(input)).rejects.toThrow("The AI failed to respond. Please try again.");
  });

  it('should propagate other errors from the AI prompt function', async () => {
    const errorMessage = 'AI model service unavailable';
    mockPrompt.mockRejectedValue(new Error(errorMessage));

    const input: MockInterviewState = {
        ...baseInput,
        history: []
    };

    await expect(getMockInterviewResponse(input)).rejects.toThrow(errorMessage);
  });
});
