
import { getCulinarySuggestion } from '../culinary-assistant-flow';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Recipe } from '@/lib/schemas';

// Mock the entire genkit AI module
jest.mock('@/ai/genkit', () => ({
  ai: {
    definePrompt: jest.fn(),
    generate: jest.fn(),
  },
}));

// A mock prompt function that we can control in each test
const mockPrompt = jest.fn();
const mockGenerate = ai.generate as jest.Mock;

describe('Culinary Assistant Flow', () => {
  beforeEach(() => {
    // Before each test, reset the mock implementations
    (ai.definePrompt as jest.Mock).mockReturnValue(mockPrompt);
    mockPrompt.mockClear();
    mockGenerate.mockClear();
  });

  it('should return a text response for a general question', async () => {
    const mockTextResponse = {
      textResponse: "Of course! To properly sharpen a knife, you should use a whetstone or a knife sharpener. Hold the knife at a 20-degree angle and stroke it across the stone from heel to tip.",
    };
    mockPrompt.mockResolvedValue({ output: mockTextResponse });

    const result = await getCulinarySuggestion("How do I sharpen a knife?");
    
    expect(ai.definePrompt).toHaveBeenCalled();
    expect(mockPrompt).toHaveBeenCalledWith({ query: "How do I sharpen a knife?", userName: 'buddy' });
    expect(result).toEqual(mockTextResponse);
    expect(mockGenerate).not.toHaveBeenCalled();
    expect(result).not.toHaveProperty('recipeName');
  });

  it('should return a recipe object with an image when asked for a recipe', async () => {
    const mockRecipeResponse: Omit<Recipe, 'imageDataUri'> = {
        recipeName: "Spaghetti Carbonara",
        description: "A classic Italian pasta dish.",
        prepTime: "10 minutes",
        cookTime: "15 minutes",
        servings: "2",
        ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan Cheese", "Black Pepper"],
        instructions: ["Cook spaghetti.", "Fry pancetta.", "Mix eggs and cheese.", "Combine everything."],
    };
    const mockImageDataUri = 'data:image/png;base64,mock-image-data';

    mockPrompt.mockResolvedValue({ output: mockRecipeResponse });
    mockGenerate.mockResolvedValue({ media: { url: mockImageDataUri } });

    const result = await getCulinarySuggestion("Can I have a recipe for carbonara?") as Recipe;

    expect(mockPrompt).toHaveBeenCalledWith({ query: "Can I have a recipe for carbonara?", userName: 'buddy' });
    expect(mockGenerate).toHaveBeenCalled();
    expect(result.recipeName).toBe(mockRecipeResponse.recipeName);
    expect(result.imageDataUri).toBe(mockImageDataUri);
  });

  it('should return a recipe object without an image if image generation fails', async () => {
    const mockRecipeResponse: Omit<Recipe, 'imageDataUri'> = {
        recipeName: "Spaghetti Carbonara",
        description: "A classic Italian pasta dish.",
        prepTime: "10 minutes",
        cookTime: "15 minutes",
        servings: "2",
        ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan Cheese", "Black Pepper"],
        instructions: ["Cook spaghetti.", "Fry pancetta.", "Mix eggs and cheese.", "Combine everything."],
    };
    
    mockPrompt.mockResolvedValue({ output: mockRecipeResponse });
    mockGenerate.mockRejectedValue(new Error('Image generation model failed'));

    const result = await getCulinarySuggestion("Can I have a recipe for carbonara?") as Recipe;

    expect(result.recipeName).toBe(mockRecipeResponse.recipeName);
    expect(result.imageDataUri).toBeUndefined();
  });


  it('should handle cases where the AI returns no output', async () => {
    mockPrompt.mockResolvedValue({ output: null });

    const result = await getCulinarySuggestion("A strange query that returns nothing");
    
    expect(result).toEqual({ textResponse: "I'm sorry, but I've run into an unexpected problem in the kitchen. Please try asking something else." });
  });
  
  it('should handle Zod validation errors gracefully', async () => {
    // This simulates the AI returning an object that doesn't match the schema, which Genkit would catch.
    const zodError = new z.ZodError([]);
    mockPrompt.mockRejectedValue(zodError);

    const result = await getCulinarySuggestion("gibberish that might cause validation error");

    expect(result).toEqual({ textResponse: "I seem to have misplaced my recipe book... My apologies! Could you try asking in a different way?" });
  });

   it('should handle rate limit errors from the AI service', async () => {
    // Simulate the Google AI API returning a 429 error message
    mockPrompt.mockRejectedValue(new Error("HTTP 429: Too many requests."));

    const result = await getCulinarySuggestion("What can I make with eggs?");
    
    expect(result).toEqual({ textResponse: "I'm very popular in the kitchen right now! Please wait a moment and try asking again." });
  });

  it('should handle JSON parsing errors gracefully', async () => {
    // Simulate the AI returning malformed JSON.
    const syntaxError = new SyntaxError("Unexpected token in JSON at position 0");
    mockPrompt.mockRejectedValue(syntaxError);

    const result = await getCulinarySuggestion("a query that results in bad json");

    expect(result).toEqual({ textResponse: "I seem to have misplaced my recipe book... My apologies! Could you try asking in a different way?" });
  });
});
    
