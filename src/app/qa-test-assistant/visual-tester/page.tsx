
"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { analyzeVisualsAction, validateLinksAction } from '@/app/actions';
import type { VisualIssue, LinkCheckResult } from "@/lib/schemas";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  Play,
  MonitorSmartphone,
  Link2,
  CheckCircle,
  FileWarning,
  Palette,
  ScanText,
  Accessibility,
  LayoutTemplate,
  Lightbulb,
  HardDrive,
  GanttChartSquare,
  Globe,
  X,
  Image as ImageIcon
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Image from 'next/image';

const crawlSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

type CrawlFormValues = z.infer<typeof crawlSchema>;

function VisualTesterForm({ onFormSubmit, isSubmitting }: { onFormSubmit: (data: CrawlFormValues) => void; isSubmitting: boolean; }) {
  const form = useForm<CrawlFormValues>({
    resolver: zodResolver(crawlSchema),
    defaultValues: {
      url: 'https://stytch.com/',
    },
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
            <MonitorSmartphone className="mr-3 h-6 w-6 text-primary" />
            Visual &amp; Link Tester
        </CardTitle>
        <CardDescription className="text-md text-muted-foreground">
            Enter a URL to get a comprehensive report. We'll show a live preview if possible, or a screenshot if not.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Website URL</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input placeholder="https://example.com" {...field} />
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                        {isSubmitting ? 'Analyzing...' : 'Run Analysis'}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function ResultsDisplay({ visualIssues, linkResults }: { visualIssues: VisualIssue[], linkResults: LinkCheckResult[] }) {
    const getSeverityVariant = (
        severity: VisualIssue["severity"]
      ): "destructive" | "default" | "secondary" | "outline" => {
        switch (severity) {
          case "critical":
          case "high":
            return "destructive";
          case "medium":
            return "default";
          case "low":
            return "secondary";
          default:
            return "outline";
        }
      };
    
      const getIssueTypeIcon = (type: VisualIssue["type"]) => {
        switch (type) {
          case "layout":
            return <LayoutTemplate className="h-4 w-4 text-blue-500" />;
          case "content":
            return <ScanText className="h-4 w-4 text-green-500" />;
          case "design":
            return <Palette className="h-4 w-4 text-purple-500" />;
          case "accessibility":
            return <Accessibility className="h-4 w-4 text-orange-500" />;
          default:
            return <FileWarning className="h-4 w-4 text-gray-500" />;
        }
      };
    
      const getLinkStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return "text-green-500";
        if (status >= 400) return "text-red-500";
        if (status >= 300) return "text-yellow-500";
        return "text-gray-500";
      };

      return (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Analysis Report</CardTitle>
            <CardDescription>
              Found {visualIssues.length} potential visual issue(s) and validated{" "}
              {linkResults.length} link(s).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="visual-issues" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="visual-issues">
                  <MonitorSmartphone className="mr-2 h-4 w-4" /> Visual Issues ({visualIssues.length})
                </TabsTrigger>
                <TabsTrigger value="link-statuses">
                  <Link2 className="mr-2 h-4 w-4" /> Link Statuses ({linkResults.length})
                </TabsTrigger>
              </TabsList>
    
              <TabsContent value="visual-issues">
                <ScrollArea className="h-[calc(100vh-22rem)]">
                    {visualIssues.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                        <h3 className="mt-4 text-lg font-medium">
                        No Visual Issues Found
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                        The AI analysis did not detect any significant UI/UX or accessibility issues.
                        </p>
                    </div>
                    ) : (
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full mt-4"
                        defaultValue="item-0"
                    >
                        {visualIssues.map((issue, index) => (
                        <AccordionItem value={`item-${index}`} key={issue.id}>
                            <AccordionTrigger>
                            <div className="flex items-center gap-4 flex-grow text-left">
                                {getIssueTypeIcon(issue.type)}
                                <span className="flex-grow font-semibold">
                                {issue.title}
                                </span>
                                <Badge
                                variant={getSeverityVariant(issue.severity)}
                                className="capitalize ml-auto"
                                >
                                {issue.severity}
                                </Badge>
                            </div>
                            </AccordionTrigger>
                            <AccordionContent>
                            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                                <p className="text-sm text-muted-foreground">
                                {issue.description}
                                </p>
                                {issue.element && (
                                <div>
                                    <h4 className="font-semibold text-xs mb-1">
                                    Selector
                                    </h4>
                                    <code className="text-xs bg-gray-700 text-white p-1 rounded-sm">
                                    {issue.element}
                                    </code>
                                </div>
                                )}
                                <div>
                                <h4 className="font-semibold text-xs mb-2 flex items-center">
                                    <Lightbulb className="h-4 w-4 mr-1 text-yellow-400" />{" "}
                                    Suggestions
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    {issue.suggestions.map((suggestion, i) => (
                                    <li key={i}>{suggestion}</li>
                                    ))}
                                </ul>
                                </div>
                            </div>
                            </AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                    )}
                </ScrollArea>
              </TabsContent>
    
              <TabsContent value="link-statuses">
                <ScrollArea className="h-[calc(100vh-22rem)] mt-4 rounded-md border">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background shadow-sm">
                      <TableRow>
                        <TableHead>URL</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead>Status Text</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {linkResults.map((link) => (
                        <TableRow key={link.url}>
                          <TableCell className="max-w-xs truncate">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {link.url}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "font-mono",
                                getLinkStatusColor(link.status)
                              )}
                            >
                              {link.status}
                            </Badge>
                          </TableCell>
                          <TableCell className={cn(getLinkStatusColor(link.status))}>
                            {link.statusText}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      );
}

export default function VisualTesterPage() {
  const [visualIssues, setVisualIssues] = useState<VisualIssue[]>([]);
  const [linkResults, setLinkResults] = useState<LinkCheckResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'none' | 'iframe' | 'image'>('none');
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async (data: CrawlFormValues) => {
    setIsLoading(true);
    setError(null);
    setVisualIssues([]);
    setLinkResults([]);
    setAnalyzedUrl(data.url);
    setPreviewType('none');
    setScreenshotData(null);

    try {
        // Step 1: Check if the URL can be iframed
        const { data: { canBeFramed } } = await axios.post('/api/check-url', { url: data.url });
        
        // Generate a placeholder screenshot URL. This avoids the 'canvas' dependency.
        const seed = data.url.replace(/[^a-zA-Z0-9]/g, '');
        const screenshotDataUri = `https://picsum.photos/seed/${seed}/1920/1080`;

        if (canBeFramed) {
            setPreviewType('iframe');
        } else {
            setPreviewType('image');
            toast({
                title: "Live Preview Unavailable",
                description: "This site cannot be shown in a live preview. A placeholder image will be used for analysis.",
            });
            setScreenshotData(screenshotDataUri);
        }
        
        // Step 2: Run link and visual analysis in parallel
        const linksPromise = validateLinksAction({ url: data.url });
        const visualPromise = analyzeVisualsAction({
            pageUrl: data.url,
            screenshotDataUri: screenshotDataUri,
        });

        const [linksSettled, visualsSettled] = await Promise.allSettled([linksPromise, visualPromise]);

        // Process link results
        if (linksSettled.status === 'fulfilled' && linksSettled.value.success) {
            setLinkResults(linksSettled.value.data || []);
        } else {
            const linkError = (linksSettled.status === 'fulfilled' && linksSettled.value.error) || (linksSettled.status === 'rejected' && linksSettled.reason?.message) || "Link validation failed.";
            toast({ title: "Link Check Warning", description: linkError, variant: "destructive" });
        }
        
        // Process visual results
        if (visualsSettled.status === 'fulfilled') {
            setVisualIssues(visualsSettled.value);
        } else {
            throw new Error(visualsSettled.reason?.message || "Visual analysis failed.");
        }

        toast({
            title: "Analysis Complete",
            description: `Found ${visualsSettled.status === 'fulfilled' ? visualsSettled.value.length : 0} issues and validated ${linksSettled.status === 'fulfilled' && linksSettled.value.data ? linksSettled.value.data.length : 0} links.`,
        });

    } catch (err: any) {
        console.error("Visual analysis failed:", err);
        const errorMessage = err.response?.data?.error || err.message || "An unknown error occurred during the analysis.";
        setError(errorMessage);
        toast({
            title: "Analysis Failed",
            description: errorMessage,
            variant: "destructive",
        });
        setPreviewType('none');
    } finally {
        setIsLoading(false);
    }
  };

  const renderPreview = () => {
    switch (previewType) {
        case 'iframe':
            return (
                 <iframe
                    src={analyzedUrl!}
                    className="w-full h-[calc(100vh-16rem)] border rounded-md"
                    sandbox="allow-scripts allow-same-origin"
                    title="Live Website Preview"
                ></iframe>
            );
        case 'image':
            return (
                <div className="w-full h-[calc(100vh-16rem)] border rounded-md relative bg-muted overflow-hidden">
                    {screenshotData ? (
                        <Image
                            src={screenshotData}
                            alt="Website Screenshot"
                            layout="fill"
                            objectFit="contain"
                            objectPosition="top"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    )}
                </div>
            );
        default:
            return null;
    }
  }
  
  const PreviewTitle = () => {
      if (previewType === 'iframe') {
          return <><Globe className="mr-2 h-5 w-5"/> Live Preview</>;
      }
      if (previewType === 'image') {
          return <><ImageIcon className="mr-2 h-5 w-5"/> Screenshot Preview</>;
      }
      return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <VisualTesterForm 
        onFormSubmit={handleAnalysis}
        isSubmitting={isLoading}
      />
      
      {error && !isLoading && (
            <Alert variant="destructive" className="mt-8">
              <FileWarning className="h-4 w-4" />
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
      )}

      {analyzedUrl ? (
         <div className="mt-8 grid md:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">{PreviewTitle()}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setAnalyzedUrl(null)}>
                        <X className="h-4 w-4"/>
                    </Button>
                </CardHeader>
                <CardContent>
                    {renderPreview()}
                     <p className="text-xs text-muted-foreground mt-2">
                        {previewType === 'iframe' && 'Note: Some websites may not load in the preview due to security restrictions. The analysis will still work correctly.'}
                        {previewType === 'image' && 'A live preview was blocked by the site\'s security policy, so a static screenshot is shown instead.'}
                    </p>
                </CardContent>
            </Card>
            <div className="sticky top-24">
                {isLoading && previewType === 'none' ? (
                    <Card className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                            <p className="mt-4 text-muted-foreground">Analyzing... please wait.</p>
                        </div>
                    </Card>
                ) : (
                    <ResultsDisplay
                        visualIssues={visualIssues}
                        linkResults={linkResults}
                    />
                )}
            </div>
         </div>
      ) : (
        <div className="mt-8 grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <HardDrive className="mr-2 h-5 w-5 text-primary"/>
                        How it Works
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-2">
                    <p>1. **URL Check:** The system first checks if the site allows live previews.</p>
                    <p>2. **Preview &amp; Analyze:** A live preview is shown if possible; otherwise, a screenshot is taken. In parallel, links are crawled and the view is sent to an AI for analysis.</p>
                    <p>3. **Review:** See the preview/screenshot while the AI identifies potential layout bugs &amp; WCAG violations and checks link statuses.</p>
                    <p>4. **Report:** A comprehensive report is generated in the panel next to the preview.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <GanttChartSquare className="mr-2 h-5 w-5 text-primary"/>
                        What We Check For
                    </CardTitle>
                </CardHeader>
                  <CardContent className="text-muted-foreground space-y-3">
                    <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-1 text-primary/80 shrink-0"/>
                            <span><span className="font-medium text-foreground/90">Visual/Layout Issues:</span> Overlapping elements, broken grids, inconsistent spacing.</span>
                        </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-1 text-primary/80 shrink-0"/>
                            <span><span className="font-medium text-foreground/90">Accessibility (WCAG):</span> Poor color contrast, small text, tiny buttons, and more.</span>
                        </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-1 text-primary/80 shrink-0"/>
                            <span><span className="font-medium text-foreground/90">Broken Links:</span> All links on the page are checked for 4xx or 5xx status codes.</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
