
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TrendingUp, Loader2, Sparkles, PieChart, LineChart, ListChecks, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLoader } from '@/context/loader-context';
import { InvestmentAdvisorInputSchema, type InvestmentAdvisorOutput } from '@/lib/schemas';
import type { z } from 'zod';
import { getInvestmentPortfolio } from '@/ai/flows/investment-advisor-flow';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Pie, Cell, PieChart as RechartsPieChart } from 'recharts';
import { Badge } from '@/components/ui/badge';

type InvestmentFormValues = z.infer<typeof InvestmentAdvisorInputSchema>;

export default function InvestmentAdvisorPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const [analysisResult, setAnalysisResult] = useState<InvestmentAdvisorOutput | null>(null);

  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(InvestmentAdvisorInputSchema),
    defaultValues: {
      age: 35,
      investmentAmount: 100000,
      riskTolerance: 'medium',
      timeHorizon: 'long-term',
      financialGoals: 'Retirement and long-term growth',
    },
  });

  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'Please log in to access this page.' });
      router.push(`/login?redirect_to=${pathname}`);
    }
  }, [user, isAuthLoading, router, toast, pathname]);

  async function onSubmit(values: InvestmentFormValues) {
    setIsSubmitting(true);
    setAnalysisResult(null);
    showLoader();
    try {
      const result = await getInvestmentPortfolio(values);
      setAnalysisResult(result);
       toast({
        title: "Portfolio Generated",
        description: "Your personalized investment portfolio is ready for review!",
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
      hideLoader();
    }
  }

  if (isAuthLoading || !user) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const chartData = analysisResult?.assetAllocation || [];
  const chartConfig = chartData.reduce((acc, item, index) => ({
    ...acc,
    [item.ticker]: {
      label: `${item.assetClass}`,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    }
  }), {});

  return (
    <div className="container mx-auto max-w-5xl py-12">
      <Card className="w-full">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">AI Investment Advisor</CardTitle>
            <CardDescription>Fill out your investor profile to generate a personalized sample portfolio for the Indian market.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="investmentAmount" render={({ field }) => (<FormItem><FormLabel>Initial Investment Amount (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="riskTolerance" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Tolerance</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select your risk tolerance" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low (Prioritize capital preservation)</SelectItem>
                        <SelectItem value="medium">Medium (Balanced approach to growth and risk)</SelectItem>
                        <SelectItem value="high">High (Prioritize long-term growth, comfortable with volatility)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="timeHorizon" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Horizon</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select your time horizon" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="short-term">Short-Term (1-3 years)</SelectItem>
                        <SelectItem value="medium-term">Medium-Term (3-10 years)</SelectItem>
                        <SelectItem value="long-term">Long-Term (10+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="financialGoals" render={({ field }) => (
                  <FormItem>
                      <FormLabel>Financial Goals</FormLabel>
                      <FormControl><Textarea placeholder="e.g., Save for retirement in 20 years, buy a house, general wealth building." {...field} /></FormControl>
                      <FormDescription>Describe what you are saving for.</FormDescription>
                      <FormMessage />
                  </FormItem>
              )} />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate My Portfolio</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {analysisResult && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="text-2xl">{analysisResult.portfolioName}</CardTitle>
                <CardDescription>{analysisResult.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <section>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><PieChart className="h-5 w-5 text-primary" /> Proposed Asset Allocation</h3>
                     <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 items-center">
                        <div className="lg:col-span-2">
                             <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px] sm:h-[250px] lg:h-[300px]">
                                <RechartsPieChart>
                                    <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                                    <Pie data={chartData} dataKey="allocationPercentage" nameKey="ticker" innerRadius={60}>
                                         {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={chartConfig[entry.ticker as keyof typeof chartConfig]?.color} />
                                        ))}
                                    </Pie>
                                </RechartsPieChart>
                             </ChartContainer>
                        </div>
                        <div className="lg:col-span-3 space-y-4">
                            {analysisResult.assetAllocation.map((asset) => (
                                <div key={asset.ticker} className="flex items-start gap-3">
                                     <div className="w-3 h-3 rounded-sm mt-1.5 shrink-0" style={{ backgroundColor: chartConfig[asset.ticker as keyof typeof chartConfig]?.color }}/>
                                     <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-base">{asset.assetClass}</h4>
                                            <Badge variant="secondary" className="ml-auto">{asset.allocationPercentage}%</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{asset.rationale}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <Separator/>
                <div className="grid md:grid-cols-2 gap-8">
                    <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><LineChart className="h-5 w-5 text-primary" /> Projected Returns</h3>
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-lg font-semibold">{analysisResult.projectedReturns.range}</p>
                             <p className="text-sm text-muted-foreground mt-1">{analysisResult.projectedReturns.disclaimer}</p>
                        </div>
                    </section>
                    <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><ListChecks className="h-5 w-5 text-primary" /> Recommended Next Steps</h3>
                        <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
                        {analysisResult.recommendedNextSteps.map((step, i) => <li key={i}>{step}</li>)}
                        </ul>
                    </section>
                </div>
                 <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important Disclaimer</AlertTitle>
                  <AlertDescription>
                    This is an AI-generated sample portfolio for informational purposes only and does not constitute financial advice. All investments carry risk. You should consult with a qualified financial advisor before making any investment decisions.
                  </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
