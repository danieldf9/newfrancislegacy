
import { buildResume } from '../resume-builder-flow';
import { ai } from '@/ai/genkit';
import type { ResumeBuilderInput, ResumeBuilderOutput } from '@/lib/schemas';

// Mock the AI module
jest.mock('@/ai/genkit', () => ({
  ai: {
    definePrompt: jest.fn(),
  },
}));

// A mock prompt function
const mockPrompt = jest.fn();

describe('Resume Builder Flow', () => {
  beforeEach(() => {
    (ai.definePrompt as jest.Mock).mockReturnValue(mockPrompt);
    mockPrompt.mockClear();
  });

  const validInput: ResumeBuilderInput = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    professionalSummary: 'A passionate software developer.',
    workExperience: [
      {
        jobTitle: 'Software Engineer',
        company: 'Tech Corp',
        location: 'Anytown, USA',
        startDate: 'Jan 2020',
        endDate: 'Present',
        responsibilities: ['Developed new features.'],
      },
    ],
    education: [
      {
        degree: 'B.S. in Computer Science',
        institution: 'State University',
        location: 'Anytown, USA',
        graduationDate: 'May 2020',
      },
    ],
    skills: ['JavaScript', 'React', 'Node.js'],
  };

  it('should generate a resume and suggestions for valid input', async () => {
    const mockApiResponse: ResumeBuilderOutput = {
      resumeMarkdown: '# John Doe\n\n## Work Experience\n- Led development of new features, resulting in a 15% user engagement increase.',
      suggestions: ['Quantify achievements in your work experience.', 'Add a projects section.'],
    };
    mockPrompt.mockResolvedValue({ output: mockApiResponse });

    const result = await buildResume(validInput);

    expect(ai.definePrompt).toHaveBeenCalled();
    expect(mockPrompt).toHaveBeenCalledWith(validInput);
    expect(result).toEqual(mockApiResponse);
    expect(result.resumeMarkdown).toContain('# John Doe');
    expect(result.suggestions.length).toBe(2);
  });

  it('should throw an error if the AI provides no output', async () => {
    mockPrompt.mockResolvedValue({ output: null });

    await expect(buildResume(validInput)).rejects.toThrow("The AI failed to generate a resume. Please try adjusting your inputs.");
  });

  it('should propagate errors from the AI prompt function', async () => {
    const errorMessage = 'AI model service unavailable';
    mockPrompt.mockRejectedValue(new Error(errorMessage));

    await expect(buildResume(validInput)).rejects.toThrow(errorMessage);
  });
});
