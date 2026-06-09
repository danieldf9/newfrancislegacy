
import { generateImage } from '../generate-image-flow';
import { ai } from '@/ai/genkit';
import type { GenerateImageInput } from '@/lib/schemas';

// Mock the AI module
jest.mock('@/ai/genkit', () => ({
  ai: {
    generate: jest.fn(),
    defineFlow: jest.fn((config, implementation) => implementation),
  },
}));

const mockAiGenerate = ai.generate as jest.Mock;

describe('Generate Image Flow', () => {
  beforeEach(() => {
    mockAiGenerate.mockClear();
  });

  it('should generate an image and return its data URI on success', async () => {
    const mockImageDataUri = 'data:image/png;base64,mock-image-data';
    mockAiGenerate.mockResolvedValue({
      media: { url: mockImageDataUri },
    });

    const input: GenerateImageInput = {
      prompt: 'A photo of a cat',
      aspectRatio: '1:1',
    };

    const result = await generateImage(input);

    expect(mockAiGenerate).toHaveBeenCalled();
    expect(result).toEqual({ imageData: mockImageDataUri });
  });

  it('should throw an error if the AI model does not return any media', async () => {
    mockAiGenerate.mockResolvedValue({ media: null });

    const input: GenerateImageInput = {
      prompt: 'A prompt that fails to generate media',
      aspectRatio: '16:9',
    };

    await expect(generateImage(input)).rejects.toThrow(
      'Image generation failed. The model did not return any media.'
    );
  });
  
  it('should throw an error if the AI model returns media without a URL', async () => {
    mockAiGenerate.mockResolvedValue({ media: { url: null } });

    const input: GenerateImageInput = {
      prompt: 'A prompt that fails to generate a url',
      aspectRatio: '16:9',
    };

    await expect(generateImage(input)).rejects.toThrow(
      'Image generation failed. The model did not return any media.'
    );
  });

  it('should propagate errors from the AI generation function', async () => {
    const errorMessage = 'AI service unavailable';
    mockAiGenerate.mockRejectedValue(new Error(errorMessage));

    const input: GenerateImageInput = {
      prompt: 'This will fail',
      aspectRatio: '1:1',
    };

    await expect(generateImage(input)).rejects.toThrow(errorMessage);
  });
});
