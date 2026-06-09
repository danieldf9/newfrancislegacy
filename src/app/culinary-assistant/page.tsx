
'use client';

import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, ChefHat, Sparkles, AlertTriangle, Clock, Users, Star, Soup } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getCulinarySuggestion } from '@/ai/flows/culinary-assistant-flow';
import type { CulinarySuggestionOutput, Recipe } from '@/lib/schemas';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: CulinarySuggestionOutput;
}

const welcomeMessage: Message = {
    id: 'welcome-1',
    role: 'assistant',
    content: {
        textResponse: "Hello! I'm your personal Culinary Assistant. What are we cooking today? You can ask me for a recipe, ideas on what to make with ingredients you have, or any other cooking questions!",
    },
};

export default function CulinaryAssistantPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'Please log in to access this page.' });
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: { textResponse: input },
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await getCulinarySuggestion(input, user?.name);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result,
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error: any) {
       const errorMessage: Message = {
        id: `assistant-error-${Date.now()}`,
        role: 'assistant',
        content: { textResponse: "I'm sorry, there was a problem in the kitchen. Please try again later." },
      };
       setMessages(prev => [...prev, errorMessage]);
       toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: error.message || 'Failed to get a response from the assistant.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Card className="shadow-lg overflow-hidden">
        <CardContent className="p-0 max-h-[60vh] overflow-y-auto">
            {recipe.imageDataUri && (
                <div className="relative aspect-video">
                    <Image src={recipe.imageDataUri} alt={recipe.recipeName} fill style={{ objectFit: 'cover' }} />
                </div>
            )}
            <div className="p-6">
                <CardHeader className="p-0">
                    <CardTitle className="text-2xl flex items-center gap-3">
                        <Soup className="h-6 w-6 text-primary" />
                        {recipe.recipeName}
                    </CardTitle>
                    <CardDescription>{recipe.description}</CardDescription>
                </CardHeader>
                <div className="mt-4">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        {recipe.prepTime && <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Prep: {recipe.prepTime}</div>}
                        {recipe.cookTime && <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Cook: {recipe.cookTime}</div>}
                        {recipe.servings && <div className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Servings: {recipe.servings}</div>}
                    </div>
                    <Separator />
                    <div className="grid md:grid-cols-3 gap-6 mt-4">
                        <div className="md:col-span-1">
                            <h4 className="font-semibold mb-2 text-lg">Ingredients</h4>
                            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                                {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                            </ul>
                        </div>
                        <div className="md:col-span-2">
                            <h4 className="font-semibold mb-2 text-lg">Instructions</h4>
                            <ol className="space-y-3 list-decimal list-inside">
                                {recipe.instructions.map((step, i) => <li key={i}><ReactMarkdown components={{p: React.Fragment}}>{step}</ReactMarkdown></li>)}
                            </ol>
                        </div>
                    </div>
                    {recipe.notes && (
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2 text-lg">Notes & Tips</h4>
                            <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">{recipe.notes}</p>
                        </div>
                    )}
                    {recipe.alternativeMethods && recipe.alternativeMethods.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2 text-lg">Alternative Methods</h4>
                            {recipe.alternativeMethods.map((method, i) => (
                                <div key={i} className="mt-2">
                                    <p className="font-bold">{method.methodName}</p>
                                    <ol className="space-y-2 list-decimal list-inside text-sm text-muted-foreground mt-1">
                                        {method.instructions.map((step, j) => <li key={j}>{step}</li>)}
                                    </ol>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </CardContent>
    </Card>
  );

  const MessageBubble = ({ message }: { message: Message }) => {
    const isUser = message.role === 'user';
    const isRecipe = 'recipeName' in message.content;
    const fallbackInitial = isUser ? (user?.name?.[0] || 'U') : 'AI';

    return (
        <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
             {!isUser && (
                <Avatar className="h-10 w-10 border">
                    <AvatarFallback><ChefHat /></AvatarFallback>
                </Avatar>
            )}
            <div className={`w-full max-w-2xl`}>
                {isRecipe ? (
                    <RecipeCard recipe={message.content as Recipe} />
                ) : (
                    <div className={cn("rounded-lg shadow", isUser ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                          <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none" components={{ p: ({children}) => <p className="mb-0">{children}</p> }}>
                            {message.content.textResponse}
                          </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
             {isUser && (
                <Avatar className="h-10 w-10 border">
                    <AvatarFallback>{fallbackInitial}</AvatarFallback>
                </Avatar>
            )}
        </div>
    )
  }

  if (isAuthLoading || !user) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex-grow container mx-auto py-4 flex flex-col">
             <ScrollArea className="flex-1 px-4" ref={scrollAreaRef as any}>
                <div className="space-y-6 pb-4">
                    {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
                     {isLoading && (
                        <div className="flex items-start gap-4">
                           <Avatar className="h-10 w-10 border"><AvatarFallback><ChefHat /></AvatarFallback></Avatar>
                           <div className="p-4 rounded-lg shadow bg-muted"><Loader2 className="h-5 w-5 animate-spin" /></div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <div className="px-4 pt-4 border-t">
                 <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask for a recipe or cooking advice..."
                        className="flex-1"
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
                <p className="text-xs text-center text-muted-foreground mt-2">
                    Culinary Assistant can make mistakes. Consider checking important information.
                </p>
            </div>
        </div>
    </div>
  );
}
