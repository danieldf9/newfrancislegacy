
'use client';

import Link from 'next/link';
import { Bot, HeartPulse, TrendingUp, ArrowRight, ShieldCheck, Mail, MonitorSmartphone, ChefHat, Dumbbell, Sparkles, FileText, ImageIcon, Trophy, Mic, BookOpen, Code, TestTube, FileUp, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RevealSection } from '@/components/layout/RevealSection';

const aiProducts = [
  {
    name: "QA Test Assistant",
    description: "Generate test cases, draft bug reports, and create Playwright code directly from Jira tickets.",
    href: "/qa-test-assistant",
    icon: <TestTube className="w-7 h-7" />,
    color: "text-cyan-400"
  },
  {
    name: "Interview Cracker",
    description: "Access study materials, practice with AI mock interviews, and build your resume.",
    href: "/interview-cracker",
    icon: <Trophy className="w-7 h-7" />,
    color: "text-amber-400"
  },
  {
    name: "Culinary Assistant",
    description: "Get recipe ideas, ask cooking questions, and receive step-by-step guidance in a conversational chat.",
    href: "/culinary-assistant",
    icon: <ChefHat className="w-7 h-7" />,
    color: "text-orange-400"
  },
  {
    name: "AI Health Suite",
    description: "Personalized meal plans, workout generation, and an extensive exercise library.",
    href: "/ai-health",
    icon: <HeartPulse className="w-7 h-7" />,
     color: "text-rose-400"
  },
  {
    name: "AI Investment Advisor",
    description: "Get a sample investment portfolio tailored for the Indian market based on your financial goals.",
    href: "/investment-advisor",
    icon: <TrendingUp className="w-7 h-7" />,
    color: "text-emerald-400"
  },
  {
    name: "Cybersecurity Center",
    description: "Analyze code snippets, logs, or text for potential security threats and scan your Gmail.",
    href: "/cybersecurity-analyzer",
    icon: <ShieldCheck className="w-7 h-7" />,
    color: "text-indigo-400"
  },
];

export default function ProductsPage() {

  return (
    <div className="relative z-10 pt-24 pb-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <RevealSection className="text-center space-y-6">
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white">
                    NEURAL <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30">GRID.</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
                    Explore our suite of intelligent assistants. Autonomous nodes designed for specific lifestyle and development challenges, optimized for performance and human-centric interaction.
                </p>
            </RevealSection>

          <RevealSection delay={200} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiProducts.map((product) => (
              <Link href={product.href} key={product.name} className="block group">
                 <Card className="flex flex-col w-full h-full p-8">
                    <CardHeader className="p-0">
                        <div className={`mb-6 ${product.color}`}>
                          {product.icon}
                        </div>
                        <CardTitle className="text-2xl font-black tracking-tight uppercase">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow p-0 mt-4">
                        <CardDescription>{product.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="p-0 mt-8">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Access Node
                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </div>
                    </CardFooter>
                 </Card>
              </Link>
            ))}
          </RevealSection>
        </div>
    </div>
  );
}
