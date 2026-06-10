
import { z } from 'zod';

// Schemas for Culinary Assistant
export const RecipeSchema = z.object({
    recipeName: z.string().describe("The name of the recipe."),
    description: z.string().describe("A brief, enticing description of the dish."),
    prepTime: z.string().describe("Preparation time, e.g., '20 minutes'."),
    cookTime: z.string().describe("Cooking time, e.g., '30 minutes'."),
    servings: z.string().describe("Number of servings the recipe makes."),
    ingredients: z.array(z.string()).describe("A list of all ingredients with quantities."),
    instructions: z.array(z.string()).describe("Step-by-step cooking instructions."),
    notes: z.string().optional().describe("Optional tips, variations, or notes for the recipe."),
    alternativeMethods: z.array(z.object({
        methodName: z.string().describe("e.g., 'Air Fryer', 'Instant Pot'"),
        instructions: z.array(z.string()).describe("Step-by-step instructions for this alternative method."),
    })).optional().describe("Optional alternative cooking methods."),
    imageDataUri: z.string().optional().describe("A photorealistic, AI-generated image of the final dish as a data URI."),
});
export type Recipe = z.infer<typeof RecipeSchema>;

export const CulinarySuggestionOutputSchema = z.union([
    RecipeSchema,
    z.object({
        textResponse: z.string().describe("A conversational response to a non-recipe query or a simple suggestion."),
    })
]);
export type CulinarySuggestionOutput = z.infer<typeof CulinarySuggestionOutputSchema>;


// Schemas for Test Case Generation
export const TestCaseSchema = z.object({
  testCaseId: z.string().describe('Unique identifier for the test case (e.g., PROJECTKEY-TEST-001).'),
  testCaseName: z.string().describe('Concise name describing the test case action and expected result.'),
  description: z.string().describe('One-sentence summary of the test case goal.'),
  precondition: z.string().describe('State or setup required before executing the test case.'),
  testSteps: z.array(z.string()).describe('Ordered list of steps to execute for the test case.'),
  expectedResult: z.string().describe('What should happen when the test steps are executed.'),
  actualResult: z.string().optional().describe('Actual outcome of the test case execution (leave blank initially).'),
  status: z.string().optional().describe('Status of the test case (e.g., Pass, Fail, Blocked; leave blank initially).'),
});

export const GenerateTestCasesInputSchema = z.object({
  description: z.string().describe('The description of the Jira ticket.'),
  acceptanceCriteria: z.string().optional().describe('The acceptance criteria of the Jira ticket.'),
  projectKey: z.string().describe('The key of the Jira project (e.g., PROJ).'),
  coverageLevel: z.enum(['Basic', 'Standard', 'End-to-End', 'Max', 'XMax']).optional().default('Basic').describe('The desired depth and coverage of the test cases.'),
});
export type GenerateTestCasesInput = z.infer<typeof GenerateTestCasesInputSchema>;

export const GenerateTestCasesOutputSchema = z.array(TestCaseSchema).describe('An array of generated test cases.');
export type GenerateTestCasesOutput = z.infer<typeof GenerateTestCasesOutputSchema>;


// Schemas for Drafting Jira Bug Reports
export const DraftJiraBugInputSchema = z.object({
  rawDescription: z.string().describe("The user's free-form text description of the bug. It might contain reproduction steps, what happened, and what was expected."),
  environmentHint: z.string().optional().describe('A hint for the environment (e.g., QA, PROD, Staging, Development). The AI should try to confirm or override this based on rawDescription.'),
  attachmentFilename: z.string().optional().describe('The filename of the attachment, if any.'),
  projectKey: z.string().describe('The key of the Jira project (e.g., PROJ).'),
});
export type DraftJiraBugInput = z.infer<typeof DraftJiraBugInputSchema>;

export const DraftJiraBugOutputSchema = z.object({
  summary: z.string().describe('A concise, AI-generated summary/title for the bug report.'),
  descriptionMarkdown: z.string().describe('A detailed, AI-generated description of the bug in Markdown format. This should include sections like "## Steps to Reproduce", "## Actual Result", "## Expected Result".'),
  identifiedEnvironment: z.string().describe('The environment identified or confirmed by the AI (e.g., QA, PROD, Staging, Development).'),
  attachmentName: z.string().optional().describe('The name of the attachment to be listed in the description (if provided in input).'),
});
export type DraftJiraBugOutput = z.infer<typeof DraftJiraBugOutputSchema>;

// Schema for data to be stored in localStorage for bug templates
export const LocalStorageBugTemplateSchema = z.object({
  projectId: z.string(),
  rawDescription: z.string(),
  environment: z.string(),
});
export type LocalStorageBugTemplate = z.infer<typeof LocalStorageBugTemplateSchema>;

// Schema for creating a bug in Jira (used by createJiraBugInJiraAction)
export const CreateJiraBugPayloadSchema = z.object({
    projectId: z.string().describe("The Jira Project ID where the bug will be created."),
    summary: z.string().describe("The summary/title of the bug."),
    descriptionMarkdown: z.string().describe("The full bug description in Markdown format (will be converted to ADF)."),
    identifiedEnvironment: z.string().describe("The environment where the bug was observed."),
});
export type CreateJiraBugPayload = z.infer<typeof CreateJiraBugPayloadSchema>;

// Schemas for Playwright Code Generation
export const PlaywrightSetupSchema = z.object({
  baseUrl: z.string().url({ message: "Please enter a valid URL." }).describe("The base URL of the application under test."),
  authFlow: z.string().optional().describe("A natural language description of the authentication process."),
  commonSelectors: z.string().optional().describe("Key-value pairs of common selectors (e.g., loginButton: '#login-btn'). One per line."),
  boilerplate: z.string().optional().describe("Boilerplate code to include at the start of every test file (e.g., imports, beforeEach)."),
});
export type PlaywrightSetup = z.infer<typeof PlaywrightSetupSchema>;

export const GeneratePlaywrightCodeInputSchema = z.object({
  testCases: GenerateTestCasesOutputSchema.describe("The array of test cases to convert to Playwright code."),
  playwrightSetup: PlaywrightSetupSchema.describe("The project-specific setup and context for Playwright."),
  projectName: z.string().describe("The name of the project for which the tests are being generated."),
});
export type GeneratePlaywrightCodeInput = z.infer<typeof GeneratePlaywrightCodeInputSchema>;

export const GeneratePlaywrightCodeOutputSchema = z.object({
    playwrightCode: z.string().describe("The generated Playwright test code as a single string."),
});
export type GeneratePlaywrightCodeOutput = z.infer<typeof GeneratePlaywrightCodeOutputSchema>;

// Schemas for Document Analysis
export const DraftTicketRecursiveSchema: z.ZodType<DraftTicketRecursive> = z.lazy(() => z.object({
  type: z.enum(["Epic", "Story", "Task", "Sub-task", "Bug"]),
  summary: z.string(),
  description: z.string(),
  acceptanceCriteria: z.string().optional(),
  suggestedId: z.string().optional(),
  children: z.array(DraftTicketRecursiveSchema).optional(),
}));

export type DraftTicketRecursive = {
  type: "Epic" | "Story" | "Task" | "Sub-task" | "Bug";
  summary: string;
  description: string;
  acceptanceCriteria?: string;
  suggestedId?: string;
  children?: DraftTicketRecursive[];
};


export const AnalyzeDocumentInputSchema = z.object({
  documentDataUri: z.string().describe("The PDF document content as a Base64-encoded data URI."),
  projectKey: z.string(),
  projectName: z.string(),
  userPersona: z.string().optional().describe("An optional hint about the target user persona to guide ticket creation."),
  outputFormatPreference: z.string().optional().describe("An optional hint about the desired output format (e.g., 'focus on user stories', 'create granular sub-tasks')."),
});
export type AnalyzeDocumentInput = z.infer<typeof AnalyzeDocumentInputSchema>;


export const AnalyzeDocumentOutputSchema = z.array(DraftTicketRecursiveSchema).describe("A hierarchical array of drafted Jira tickets (Epics, Stories, Tasks, etc.).");
export type AnalyzeDocumentOutput = z.infer<typeof AnalyzeDocumentOutputSchema>;

export const CreateJiraTicketsInputSchema = z.object({
    projectId: z.string(),
    projectKey: z.string(),
    tickets: AnalyzeDocumentOutputSchema,
});
export type CreateJiraTicketsInput = z.infer<typeof CreateJiraTicketsInputSchema>;


// Schemas for Link Validator
export const LinkValidatorInputSchema = z.object({
  url: z.string().url({ message: "Please provide a valid URL." }),
});
export type LinkValidatorInput = z.infer<typeof LinkValidatorInputSchema>;

export const LinkCheckResultSchema = z.object({
    url: z.string(),
    status: z.number(),
    statusText: z.string(),
});
export type LinkCheckResult = z.infer<typeof LinkCheckResultSchema>;

export const LinkValidatorOutputSchema = z.array(LinkCheckResultSchema);
export type LinkValidatorOutput = z.infer<typeof LinkValidatorOutputSchema>;

// Schemas for Visual Analysis
export const VisualIssueSchema = z.object({
    id: z.string(),
    type: z.enum(['layout', 'content', 'design', 'accessibility']),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    title: z.string(),
    description: z.string(),
    element: z.string().optional(),
    suggestions: z.array(z.string()),
});
export type VisualIssue = z.infer<typeof VisualIssueSchema>;


export const VisualAnalysisInputSchema = z.object({
  pageUrl: z.string().url(),
  screenshotDataUri: z.string().describe("A screenshot of the webpage as a Base64-encoded data URI."),
});
export type VisualAnalysisInput = z.infer<typeof VisualAnalysisInputSchema>;

export const VisualAnalysisOutputSchema = z.array(VisualIssueSchema);
export type VisualAnalysisOutput = z.infer<typeof VisualAnalysisOutputSchema>;

// Schemas for Live Testing Agent
export const LiveTestingInputSchema = z.object({
  url: z.string().url({ message: "Please provide a valid URL." }),
  instructions: z.string().optional().describe("Optional instructions for the agent (e.g., 'Test the login flow')"),
});
export type LiveTestingInput = z.infer<typeof LiveTestingInputSchema>;

export const LiveTestingOutputSchema = z.object({
  testsPerformed: z.array(z.string()).describe("A list of actions or tests the agent performed."),
  bugsIdentified: z.array(VisualIssueSchema).describe("A list of visual or functional bugs identified during the test."),
  agentLogs: z.array(z.string()).describe("Internal logs from the agent explaining its reasoning and actions."),
});
export type LiveTestingOutput = z.infer<typeof LiveTestingOutputSchema>;

// =================================================
// Health & Fitness Platform Schemas
// =================================================

// Input Schema for Health & Fitness Planner
export const HealthFitnessInputSchema = z.object({
  age: z.coerce.number().min(1, "Age is required"),
  weightKg: z.coerce.number().min(1, "Weight is required"),
  heightCm: z.coerce.number().min(1, "Height is required"),
  activityLevel: z.enum([
    "sedentary", "lightly-active", "moderately-active", "very-active", "extra-active"
  ]),
  fitnessGoals: z.array(z.enum(['weight_loss', 'muscle_gain', 'endurance', 'strength', 'flexibility'])).min(1, "Please select at least one fitness goal."),
  availableEquipment: z.string().describe("A comma-separated list of available fitness equipment."),
  workoutPreferences: z.array(z.enum(['gym', 'home', 'running', 'yoga'])).describe("User's preferred types of workouts"),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  medicalHistory: z.string(),
  dietaryPreferences: z.string(),
  injuriesLimitations: z.string().describe("A description of any injuries or physical limitations."),
});
export type HealthFitnessInput = z.infer<typeof HealthFitnessInputSchema>;

// Output Schema for Health & Fitness Planner
export const HealthFitnessOutputSchema = z.object({
  nutritionPlan: z.object({
    estimatedDailyCalories: z.number(),
    mealPlan: z.array(z.object({
      mealType: z.string(),
      dishName: z.string(),
      ingredients: z.array(z.string()),
      instructions: z.string(),
      calories: z.number(),
    })),
    groceryList: z.array(z.object({
      category: z.string(),
      items: z.array(z.string()),
    })),
  }),
  fitnessPlan: z.object({
    weeklyPlan: z.array(z.object({
      week: z.number(),
      focus: z.string().describe("The primary focus for this week, e.g., 'Foundation Building', 'Hypertrophy'."),
      days: z.array(z.object({
        day: z.number(),
        title: z.string().describe("Title for the workout day, e.g., 'Full Body Strength A', 'Active Recovery'"),
        exercises: z.array(z.object({
          name: z.string(),
          sets: z.string(),
          reps: z.string(),
        }))
      }))
    }))
  }),
  progressTracking: z.object({
    metrics: z.array(z.string()).describe("Key metrics the user should track, e.g., 'Body Weight', 'Waist Circumference', 'Bench Press 1RM'."),
  }),
  gamificationSetup: z.object({
    achievements: z.array(z.object({
      name: z.string(),
      description: z.string(),
    })).describe("Initial achievements the user can unlock."),
  }),
  aiCoachRecommendations: z.array(z.string()).describe("Personalized motivational tips and advice from the AI coach."),
});
export type HealthFitnessOutput = z.infer<typeof HealthFitnessOutputSchema>;

// Schema for a single exercise in the library
export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  muscleGroup: z.string(),
  equipment: z.string(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  instructions: z.array(z.string()),
  videoUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  imageHint: z.string().optional(),
});
export type Exercise = z.infer<typeof ExerciseSchema>;

// Schema for on-demand daily workout generation
export const DailyWorkoutInputSchema = z.object({
  // These are assumed to come from the user's main profile
  fitnessGoals: z.array(z.enum(['weight_loss', 'muscle_gain', 'endurance', 'strength', 'flexibility'])).min(1),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  // These are the specific requests for today's workout
  workoutPreference: z.string().describe("The user's desired workout type for the session, e.g., Strength, HIIT, Yoga, Cardio"),
  targetMuscleGroups: z.string().describe("The muscle groups the user wants to focus on today, e.g., Full Body, Upper Body, Legs"),
  workoutDuration: z.string().describe("The desired duration for the workout session, e.g., 30 minutes, 1 hour"),
  availableEquipment: z.string().describe("Equipment available for this specific session."),
});
export type DailyWorkoutInput = z.infer<typeof DailyWorkoutInputSchema>;

export const DailyWorkoutOutputSchema = z.object({
  workoutTitle: z.string(),
  workoutType: z.string(),
  estimatedDuration: z.string(),
  phases: z.array(z.object({
    phaseName: z.enum(["Warm-up", "Main Workout", "Cool-down"]),
    exercises: z.array(z.object({
      name: z.string(),
      sets: z.string().optional(),
      reps: z.string().optional(),
      duration: z.string().optional(),
      rest: z.string().optional().describe("Rest period after this exercise."),
      notes: z.string().optional().describe("Specific instructions or tips for this exercise."),
    })),
  })),
});
export type DailyWorkoutOutput = z.infer<typeof DailyWorkoutOutputSchema>;


// Schemas for Investment Advisor
export const InvestmentAdvisorInputSchema = z.object({
  age: z.coerce.number().min(18, "You must be at least 18 years old."),
  investmentAmount: z.coerce.number().min(1000, "Investment amount must be at least ₹1,000."),
  riskTolerance: z.enum(['low', 'medium', 'high']),
  timeHorizon: z.enum(['short-term', 'medium-term', 'long-term']),
  financialGoals: z.string().min(10, "Please describe your financial goals."),
});
export type InvestmentAdvisorInput = z.infer<typeof InvestmentAdvisorInputSchema>;

export const InvestmentAdvisorOutputSchema = z.object({
    portfolioName: z.string(),
    summary: z.string(),
    assetAllocation: z.array(z.object({
        assetClass: z.string(),
        ticker: z.string(),
        allocationPercentage: z.number(),
        rationale: z.string().describe("Explanation for why this asset is recommended, including its current price."),
    })),
    projectedReturns: z.object({
        range: z.string(),
        disclaimer: z.string(),
    }),
    recommendedNextSteps: z.array(z.string()),
});
export type InvestmentAdvisorOutput = z.infer<typeof InvestmentAdvisorOutputSchema>;

// Schemas for Cybersecurity Threat Analyzer
export const CybersecurityThreatAnalyzerInputSchema = z.object({
  text: z.string().min(1, 'Text to analyze cannot be empty.'),
});
export type CybersecurityThreatAnalyzerInput = z.infer<typeof CybersecurityThreatAnalyzerInputSchema>;

export const IocSchema = z.object({
  type: z.string().describe("The category of the indicator (e.g., 'IP Address', 'Domain', 'File Hash', 'URL', 'CVE')."),
  value: z.string().describe("The actual value of the indicator."),
  context: z.string().describe("A brief explanation of why this indicator is suspicious."),
});

export const CybersecurityThreatAnalyzerOutputSchema = z.object({
  threatLevel: z.enum(["None", "Low", "Medium", "High", "Critical"]),
  summary: z.string().describe("A concise summary of the findings."),
  recommendations: z.array(z.string()).describe("A list of actionable steps to mitigate the threat."),
  indicatorsOfCompromise: z.array(IocSchema).optional().describe("A list of identified indicators of compromise."),
});
export type CybersecurityThreatAnalyzerOutput = z.infer<typeof CybersecurityThreatAnalyzerOutputSchema>;

// Schemas for Gmail Analyzer
export const EmailSchema = z.object({
    from: z.string(),
    subject: z.string(),
    body: z.string(),
});
export type Email = z.infer<typeof EmailSchema>;

export const GmailAnalysisResultSchema = z.object({
    email: EmailSchema,
    analysis: CybersecurityThreatAnalyzerOutputSchema,
});
export type GmailAnalysisResult = z.infer<typeof GmailAnalysisResultSchema>;

export const GmailAnalyzerFlowOutputSchema = z.object({
    results: z.array(GmailAnalysisResultSchema),
    error: z.string().optional(),
});
export type GmailAnalyzerFlowOutput = z.infer<typeof GmailAnalyzerFlowOutputSchema>;

// Schemas for AI Image Generation
export const GenerateImageInputSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty.'),
  aspectRatio: z.enum(["1:1", "16:9", "9:16", "4:3", "3:4"]).optional().default("16:9"),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
  imageData: z.string().describe("The generated image as a Base64-encoded data URI."),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

// Schemas for Interview Cracker
export const InterviewCrackerInputSchema = z.object({
    jobRole: z.string().describe('The job role the user is preparing for, e.g., "Software Engineer".'),
    experienceLevel: z.enum(['entry', 'mid', 'senior']),
    topics: z.array(z.string()).optional().describe('Specific topics the user wants to focus on.'),
});
export type InterviewCrackerInput = z.infer<typeof InterviewCrackerInputSchema>;

export const MockInterviewMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  feedback: z.string().optional(),
});
export type MockInterviewMessage = z.infer<typeof MockInterviewMessageSchema>;

export const MockInterviewStateSchema = z.object({
  jobRole: z.string(),
  experienceLevel: z.enum(['entry', 'mid', 'senior']),
  topics: z.array(z.string()).optional(),
  history: z.array(MockInterviewMessageSchema),
});
export type MockInterviewState = z.infer<typeof MockInterviewStateSchema>;

export const MockInterviewOutputSchema = z.object({
    feedback: z.string().optional().describe("Constructive feedback on the user's previous answer."),
    question: z.string().describe("The next interview question to ask the user."),
});
export type MockInterviewOutput = z.infer<typeof MockInterviewOutputSchema>;

// Schemas for Resume Builder
const WorkExperienceSchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  responsibilities: z.array(z.string()),
});

const EducationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  location: z.string(),
  graduationDate: z.string(),
});

export const ResumeBuilderInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  professionalSummary: z.string(),
  workExperience: z.array(WorkExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(z.string()),
});
export type ResumeBuilderInput = z.infer<typeof ResumeBuilderInputSchema>;

export const ResumeBuilderOutputSchema = z.object({
  resumeMarkdown: z.string().describe("The full resume formatted as a professional Markdown document."),
  suggestions: z.array(z.string()).describe("A list of actionable suggestions to improve the resume."),
});
export type ResumeBuilderOutput = z.infer<typeof ResumeBuilderOutputSchema>;

// Schemas for Coding Challenge
export const CodingChallengeInputSchema = z.object({
  challengeSlug: z.string(),
  userSolution: z.string().describe("The user's code solution for the challenge."),
});
export type CodingChallengeInput = z.infer<typeof CodingChallengeInputSchema>;

export const CodingChallengeOutputSchema = z.object({
  isCorrect: z.boolean().describe("Whether the user's solution passes all test cases."),
  feedback: z.string().describe("Detailed feedback on the solution's correctness, efficiency, and code quality, in Markdown format."),
  correctness: z.string().describe("A summary of correctness, e.g., 'All test cases passed!' or 'Failed on test case X'"),
  efficiency: z.string().describe("Analysis of the time and space complexity (Big O notation)."),
  style: z.string().describe("Feedback on code style, readability, and best practices."),
});
export type CodingChallengeOutput = z.infer<typeof CodingChallengeOutputSchema>;
