
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Mic, FileText, Briefcase, Users, Trophy, BarChart } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const interviewSections = [
  {
    title: "Preparation Materials",
    description: "Access articles, tutorials, and cheat sheets on key topics.",
    icon: <BookOpen className="h-8 w-8 text-blue-500" />,
    href: "/interview-cracker/materials",
    cta: "Browse Library",
  },
  {
    title: "AI Mock Interviews",
    description: "Practice with AI in voice or text simulations for instant feedback.",
    icon: <Mic className="h-8 w-8 text-green-500" />,
    href: "/interview-cracker/mock-interviews",
    cta: "Start a Mock Interview",
  },
  {
    title: "Peer-to-Peer Mocks",
    description: "Schedule and conduct mock interviews with other users.",
    icon: <Users className="h-8 w-8 text-purple-500" />,
    href: "/interview-cracker/peer-mocks",
    cta: "Schedule a Session",
  },
  {
    title: "Resume Builder",
    description: "Use AI-assisted templates to build and refine your resume.",
    icon: <FileText className="h-8 w-8 text-orange-500" />,
    href: "/interview-cracker/resume-builder",
    cta: "Build Your Resume",
  },
   {
    title: "Coding Challenges",
    description: "Solve algorithmic problems and get AI-powered feedback on your solutions.",
    icon: <Code className="h-8 w-8 text-red-500" />,
    href: "/interview-cracker/coding-challenges",
    cta: "Solve Challenges",
  },
  {
    title: "Job Tracker",
    description: "Keep track of your job applications, statuses, and interview dates.",
    icon: <Briefcase className="h-8 w-8 text-indigo-500" />,
    href: "/interview-cracker/job-tracker",
    cta: "Track Your Jobs",
  },
   {
    title: "Progress Dashboard",
    description: "Visualize your preparation stats and get personalized recommendations.",
    icon: <BarChart className="h-8 w-8 text-yellow-500" />,
    href: "/interview-cracker/dashboard",
    cta: "View Your Progress",
  },
];

export default function InterviewCrackerPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

   useEffect(() => {
    if (!isAuthLoading && !user) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'Please log in to access this page.' });
      router.push(`/login?redirect_to=${pathname}`);
    }
  }, [user, isAuthLoading, router, toast, pathname]);
  
  if (isAuthLoading || !user) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
          <Trophy className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Interview Cracker
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Your one-stop solution for acing your next job interview. From study materials to AI-powered mock interviews, we&apos;ve got you covered.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {interviewSections.map((section) => (
          <Card key={section.title} className="flex flex-col">
            <CardHeader className="flex-row items-start gap-4">
                <div className="mt-1">{section.icon}</div>
                <div className="flex-grow">
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow" />
            <div className="p-6 pt-0">
              <Button asChild className="w-full">
                <Link href={section.href}>{section.cta}</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
