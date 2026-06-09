'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { challenges, type CodingChallenge } from '@/lib/coding-challenges';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

interface ChallengePageProps {
  params: {
    slug: string;
  };
}

export default function ChallengePage({ params }: ChallengePageProps) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const challenge = challenges.find(c => c.slug === params.slug);
  const [code, setCode] = useState(challenge?.starterCode || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState(''); // For later use

  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'Please log in to access this page.' });
      router.push(`/login?redirect_to=${pathname}`);
    }
  }, [user, isAuthLoading, router, toast, pathname]);

  if (!challenge) {
    notFound();
  }
  
  if (isAuthLoading || !user) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getDifficultyVariant = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch(difficulty) {
        case 'Easy': return 'secondary';
        case 'Medium': return 'default';
        case 'Hard': return 'destructive';
    }
  }
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    // In a future step, we'll call the AI flow here.
    setTimeout(() => {
        toast({ title: "Submission processing...", description: "AI feedback is not yet implemented." });
        setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4">
       <Button asChild variant="outline" className="mb-8">
            <Link href="/interview-cracker/coding-challenges">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Challenges
            </Link>
        </Button>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="h-fit">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                <CardDescription className="text-md mt-1">{challenge.category}</CardDescription>
              </div>
              <Badge variant={getDifficultyVariant(challenge.difficulty)}>{challenge.difficulty}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{challenge.description}</p>
          </CardContent>
        </Card>
        
        <div>
           <Card>
             <CardHeader>
                <CardTitle>Your Solution</CardTitle>
             </CardHeader>
             <CardContent>
                <Textarea 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono bg-muted/50 h-80 text-base"
                    placeholder="// Your code here"
                />
                 <div className="flex gap-2 mt-4">
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-4 w-4" />
                        )}
                        Submit for Feedback
                    </Button>
                 </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
