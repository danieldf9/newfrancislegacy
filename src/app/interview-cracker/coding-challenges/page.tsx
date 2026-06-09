'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { challenges } from '@/lib/coding-challenges';
import { Code, ArrowRight, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter, usePathname } from 'next/navigation';

const difficulties = ['All', 'Easy', 'Medium', 'Hard'] as const;
type Difficulty = typeof difficulties[number];

export default function CodingChallengesPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>('All');

  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'Please log in to access this page.' });
      router.push(`/login?redirect_to=${pathname}`);
    }
  }, [user, isAuthLoading, router, toast, pathname]);


  const filteredChallenges = difficultyFilter === 'All'
    ? challenges
    : challenges.filter(c => c.difficulty === difficultyFilter);

  const getDifficultyVariant = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch(difficulty) {
        case 'Easy': return 'secondary';
        case 'Medium': return 'default';
        case 'Hard': return 'destructive';
    }
  }
  
  if (isAuthLoading || !user) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <header className="text-center mb-12">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
          <Code className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Coding Challenges
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Sharpen your problem-solving skills with our collection of coding challenges.
        </p>
      </header>

      <div className="mb-8 flex justify-end">
        <Select value={difficultyFilter} onValueChange={(value) => setDifficultyFilter(value as Difficulty)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
                {difficulties.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {filteredChallenges.map(challenge => (
          // The link will be broken until the next step, which is fine.
          <Link href={`/interview-cracker/coding-challenges/${challenge.slug}`} key={challenge.slug} className="block group">
            <Card className="hover:border-primary transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{challenge.title}</CardTitle>
                   <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardDescription className="pt-2 line-clamp-2">{challenge.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                    <Badge variant={getDifficultyVariant(challenge.difficulty)}>{challenge.difficulty}</Badge>
                    <Badge variant="outline">{challenge.category}</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
