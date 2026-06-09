
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, Sparkles, AlertTriangle, ListChecks, CheckCircle, Fingerprint, Mail, Link as LinkIcon, Unlink, Inbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLoader } from '@/context/loader-context';
import { CybersecurityThreatAnalyzerInputSchema, type CybersecurityThreatAnalyzerOutput, type GmailAnalyzerFlowOutput } from '@/lib/schemas';
import type { z } from 'zod';
import { analyzeForThreats } from '@/ai/flows/cybersecurity-threat-analyzer-flow';
import { analyzeGmail, checkGmailAuthStatus, disconnectGmail } from '@/ai/flows/gmail-analyzer-flow';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type ThreatAnalyzerFormValues = z.infer<typeof CybersecurityThreatAnalyzerInputSchema>;

export default function CybersecurityAnalyzerPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  
  // State for text analysis
  const [textAnalysisResult, setTextAnalysisResult] = useState<CybersecurityThreatAnalyzerOutput | null>(null);
  
  // State for Gmail analysis
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [gmailAnalysisResult, setGmailAnalysisResult] = useState<GmailAnalyzerFlowOutput | null>(null);

  const form = useForm<ThreatAnalyzerFormValues>({
    resolver: zodResolver(CybersecurityThreatAnalyzerInputSchema),
    defaultValues: { text: '' },
  });

  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'Please log in to access this page.' });
      router.push(`/login?redirect_to=${pathname}`);
    } else if (user) {
      checkGmailAuthStatus().then(status => {
        setIsGmailConnected(status.isConnected);
        setIsCheckingAuth(false);
      });
    }
  }, [user, isAuthLoading, router, toast, pathname]);

  async function onTextSubmit(values: ThreatAnalyzerFormValues) {
    setIsSubmitting(true);
    setTextAnalysisResult(null);
    showLoader();
    try {
      const result = await analyzeForThreats(values);
      setTextAnalysisResult(result);
      toast({ title: "Analysis Complete", description: "The security analysis is complete." });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Analysis Failed', description: error.message || 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
      hideLoader();
    }
  }

  async function handleAnalyzeGmail() {
    setIsSubmitting(true);
    setGmailAnalysisResult(null);
    showLoader();
    try {
      const result = await analyzeGmail();
      setGmailAnalysisResult(result);
      toast({ title: "Analysis Complete", description: result.error || `Finished scanning your emails.` });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Analysis Failed', description: error.message || 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
      hideLoader();
    }
  }

  const handleDisconnect = async () => {
    await disconnectGmail();
    setIsGmailConnected(false);
    toast({ title: 'Success', description: 'Your Gmail account has been disconnected.' });
  }

  if (isAuthLoading || !user) {
    return <div className="flex min-h-[400px] w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const getThreatLevelVariant = (level: CybersecurityThreatAnalyzerOutput['threatLevel']): "default" | "secondary" | "destructive" => {
    if (!level) return "secondary";
    switch (level) {
      case "Critical":
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low":
      case "None": return "secondary";
      default: return "secondary";
    }
  }

  const getThreatIcon = (isThreat: boolean) => isThreat ? <ShieldCheck className="h-5 w-5 text-destructive" /> : <ShieldCheck className="h-5 w-5 text-green-500" />;

  const renderAnalysisReport = (result: CybersecurityThreatAnalyzerOutput | null) => {
    if (!result) return null;
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-2xl">Security Analysis Report</CardTitle>
          <div className="flex items-center gap-4 pt-2">
            <span className="font-semibold">Threat Level:</span>
            <Badge variant={getThreatLevelVariant(result.threatLevel)} className="text-base px-4 py-1">{result.threatLevel}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2"><AlertTriangle className="h-5 w-5 text-primary" /> Analysis Summary</h3>
            <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">{result.summary}</p>
          </section>
          {result.indicatorsOfCompromise && result.indicatorsOfCompromise.length > 0 && (
            <section>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-2"><Fingerprint className="h-5 w-5 text-primary" /> Indicators of Compromise (IoCs)</h3>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Value</TableHead><TableHead>Context</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {result.indicatorsOfCompromise.map((ioc, i) => (
                      <TableRow key={i}><TableCell><Badge variant="outline">{ioc.type}</Badge></TableCell><TableCell className="font-mono">{ioc.value}</TableCell><TableCell>{ioc.context}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>
          )}
          <Separator/>
          <section>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2"><ListChecks className="h-5 w-5 text-primary" /> Recommended Actions</h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" /><span className="text-muted-foreground">{rec}</span></li>
              ))}
            </ul>
          </section>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Card className="w-full">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">AI Security Center</CardTitle>
            <CardDescription>Analyze text or scan your recent Gmail messages for potential security threats.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="text-input" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text-input">Text Input</TabsTrigger>
                    <TabsTrigger value="gmail-scan">Scan Gmail</TabsTrigger>
                </TabsList>
                <TabsContent value="text-input" className="pt-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onTextSubmit)} className="space-y-6">
                      <FormField control={form.control} name="text" render={({ field }) => (
                          <FormItem>
                              <FormLabel>Text to Analyze</FormLabel>
                              <FormControl><Textarea placeholder="Paste your code, logs, or email text here..." {...field} rows={10} /></FormControl>
                              <FormMessage />
                          </FormItem>
                      )} />
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Text...</> : <><Sparkles className="mr-2 h-4 w-4" /> Analyze for Threats</>}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                <TabsContent value="gmail-scan" className="pt-4">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    {isCheckingAuth ? <Loader2 className="h-6 w-6 animate-spin" /> : !isGmailConnected ? (
                      <>
                        <p className="text-muted-foreground">Connect your Google account to scan your 5 most recent emails for threats.</p>
                        <a href="/api/auth/google/login"><Button size="lg"><LinkIcon className="mr-2 h-4 w-4" /> Connect with Google</Button></a>
                      </>
                    ) : (
                      <div className='flex flex-col items-center space-y-4 w-full max-w-xs'>
                        <p className="text-muted-foreground">Your Gmail is connected. Scan your inbox now.</p>
                        <Button onClick={handleAnalyzeGmail} disabled={isSubmitting} size="lg" className="w-full">
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Gmail...</> : <><Mail className="mr-2 h-4 w-4" /> Scan My Inbox</>}
                        </Button>
                        <Button onClick={handleDisconnect} variant="link" size="sm" className="text-muted-foreground"><Unlink className="mr-2 h-4 w-4" /> Disconnect Gmail</Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
      
      {textAnalysisResult && renderAnalysisReport(textAnalysisResult)}

      {gmailAnalysisResult && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="text-2xl">Gmail Inbox Analysis Report</CardTitle>
                <CardDescription>{gmailAnalysisResult.error || "Here is the security analysis of your 5 most recent emails."}</CardDescription>
            </CardHeader>
            <CardContent>
                {gmailAnalysisResult.results.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                        {gmailAnalysisResult.results.map(({ email, analysis }, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>
                                    <div className="flex items-center gap-4 flex-grow">
                                        {getThreatIcon(analysis.threatLevel !== 'None' && analysis.threatLevel !== 'Low')}
                                        <div className="flex-grow text-left">
                                            <p className="font-semibold truncate">{email.subject}</p>
                                            <p className="text-sm text-muted-foreground">From: {email.from}</p>
                                        </div>
                                        <Badge variant={getThreatLevelVariant(analysis.threatLevel)} className="ml-auto capitalize">{analysis.threatLevel}</Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                                        {renderAnalysisReport(analysis)}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : !gmailAnalysisResult.error ? (
                    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-semibold text-foreground">No Emails Found</p>
                        <p className="text-muted-foreground">Could not find any recent emails in your inbox.</p>
                    </div>
                ) : null}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
