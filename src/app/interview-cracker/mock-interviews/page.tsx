
'use client';

import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useLoader } from '@/context/loader-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Loader2,
  Mic,
  Sparkles,
  Send,
  User,
  MessageSquareQuote,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  MockInterviewState,
  MockInterviewMessage,
} from '@/lib/schemas';
import { getMockInterviewResponse } from '@/ai/flows/mock-interview-flow';

const setupSchema = z.object({
  jobRole: z.string().min(3, 'Please enter a job role.'),
  experienceLevel: z.enum(['entry', 'mid', 'senior']),
  topics: z.string().optional(),
});
type SetupFormValues = z.infer<typeof setupSchema>;

export default function MockInterviewPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { showLoader, hideLoader } = useLoader();

  const [interviewSettings, setInterviewSettings] =
    useState<Omit<MockInterviewState, 'history'>>();
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [messages, setMessages] = useState<MockInterviewMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const setupForm = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      jobRole: 'Software Engineer',
      experienceLevel: 'mid',
      topics: 'React, Node.js, System Design',
    },
  });

  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast({
        variant: 'destructive',
        title: 'Unauthorized',
        description: 'Please log in to access this page.',
      });
      router.push(`/login?redirect_to=${pathname}`);
    }
  }, [user, isAuthLoading, router, toast, pathname]);
  
   useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  async function handleStartInterview(values: SetupFormValues) {
    setIsLoading(true);
    showLoader();
    const settings = {
      jobRole: values.jobRole,
      experienceLevel: values.experienceLevel,
      topics: values.topics?.split(',').map((t) => t.trim()).filter(Boolean),
    };
    setInterviewSettings(settings);

    try {
      const response = await getMockInterviewResponse({ ...settings, history: [] });
      setMessages([{ role: 'assistant', content: response.question }]);
      setIsInterviewStarted(true);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to start interview',
        description:
          error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
      hideLoader();
    }
  }

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newUserMessage: MockInterviewMessage = {
      role: 'user',
      content: input,
    };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    showLoader();

    try {
      const response = await getMockInterviewResponse({
        ...(interviewSettings!),
        history: newMessages,
      });

      const newAssistantMessage: MockInterviewMessage = {
        role: 'assistant',
        content: response.question,
        feedback: response.feedback,
      };
      setMessages((prev) => [...prev, newAssistantMessage]);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error.message || 'The AI interviewer failed to respond.',
      });
    } finally {
      setIsLoading(false);
      hideLoader();
    }
  };

  const MessageBubble = ({ msg }: { msg: MockInterviewMessage }) => (
    <div
      className={cn(
        'flex items-start gap-4',
        msg.role === 'user' && 'justify-end'
      )}
    >
      {msg.role === 'assistant' && (
        <Avatar className="h-10 w-10 border">
          <AvatarFallback>
            <Mic />
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col gap-2 max-w-2xl">
        {msg.feedback && (
          <div className="rounded-lg bg-yellow-500/10 p-3 text-sm text-yellow-200 border border-yellow-500/30">
            <h4 className="font-bold flex items-center gap-2 mb-1"><Lightbulb className="h-4 w-4" /> Feedback</h4>
            <p>{msg.feedback}</p>
          </div>
        )}
        <div
          className={cn(
            'rounded-lg p-4 shadow',
            msg.role === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          )}
        >
          <p>{msg.content}</p>
        </div>
      </div>
      {msg.role === 'user' && (
        <Avatar className="h-10 w-10 border">
          <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );

  if (isAuthLoading || !user) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      {!isInterviewStarted ? (
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
              <Mic className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">AI Mock Interview</CardTitle>
            <CardDescription>
              Set up your mock interview session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...setupForm}>
              <form
                onSubmit={setupForm.handleSubmit(handleStartInterview)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={setupForm.control}
                    name="jobRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Role</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Frontend Developer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={setupForm.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="entry">Entry-Level</SelectItem>
                            <SelectItem value="mid">Mid-Level</SelectItem>
                            <SelectItem value="senior">Senior-Level</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={setupForm.control}
                  name="topics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topics to Cover (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., JavaScript, React Hooks, Behavioral Questions"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        Comma-separated list of topics you want to focus on.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Starting...' : 'Start Mock Interview'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col h-[calc(100vh-10rem)] bg-card border rounded-lg shadow-xl">
            <CardHeader className='border-b'>
                 <CardTitle>Mock Interview: {interviewSettings?.jobRole}</CardTitle>
                 <CardDescription>Experience Level: {interviewSettings?.experienceLevel}</CardDescription>
            </CardHeader>
          <ScrollArea className="flex-grow p-6" ref={scrollAreaRef as any}>
            <div className="space-y-8">
              {messages.map((msg, index) => (
                <MessageBubble key={index} msg={msg} />
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-background rounded-b-lg">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer..."
                className="flex-1"
                rows={1}
                disabled={isLoading}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                    }
                }}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
