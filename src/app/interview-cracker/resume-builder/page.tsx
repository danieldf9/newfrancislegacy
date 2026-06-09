
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useLoader } from '@/context/loader-context';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Loader2, Wand2, PlusCircle, Trash2, FileText, Lightbulb, Check, Clipboard } from 'lucide-react';
import { ResumeBuilderInputSchema, type ResumeBuilderInput, type ResumeBuilderOutput } from '@/lib/schemas';
import { buildResume } from '@/ai/flows/resume-builder-flow';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';


export default function ResumeBuilderPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { showLoader, hideLoader } = useLoader();

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ResumeBuilderOutput | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const form = useForm<ResumeBuilderInput>({
    resolver: zodResolver(ResumeBuilderInputSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      professionalSummary: '',
      workExperience: [{ jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [''] }],
      education: [{ degree: '', institution: '', location: '', graduationDate: '' }],
      skills: [''],
    },
  });

  const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({
    control: form.control,
    name: 'workExperience',
  });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control: form.control,
    name: 'education',
  });
   const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: form.control,
    name: 'skills',
  });

  React.useEffect(() => {
    if (!isAuthLoading && !user) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'Please log in to access this page.' });
      router.push(`/login?redirect_to=${pathname}`);
    } else if(user) {
        form.setValue('name', user.name);
        form.setValue('email', user.email);
    }
  }, [user, isAuthLoading, router, toast, pathname, form]);

  const onSubmit = async (values: ResumeBuilderInput) => {
    setIsGenerating(true);
    setResult(null);
    showLoader();
    try {
      const response = await buildResume(values);
      setResult(response);
      toast({ title: 'Success!', description: 'Your AI-powered resume draft is ready.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Generation Failed', description: error.message || 'An unexpected error occurred.' });
    } finally {
      setIsGenerating(false);
      hideLoader();
    }
  };
  
  const copyToClipboard = () => {
    if (result?.resumeMarkdown) {
      navigator.clipboard.writeText(result.resumeMarkdown);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  if (isAuthLoading || !user) {
    return <div className="flex min-h-[400px] w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto max-w-6xl py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2"><FileText className="h-8 w-8 text-primary" /></div>
          <CardTitle className="text-3xl">AI Resume Builder</CardTitle>
          <CardDescription>Enter your professional details and let AI craft a standout resume for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Details */}
              <Card>
                <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                </CardContent>
              </Card>

              {/* Professional Summary */}
              <Card>
                 <CardHeader><CardTitle>Professional Summary</CardTitle></CardHeader>
                 <CardContent>
                    <FormField control={form.control} name="professionalSummary" render={({ field }) => (<FormItem><FormControl><Textarea placeholder="A brief, 2-3 sentence summary of your career, skills, and goals." {...field} rows={4} /></FormControl><FormMessage /></FormItem>)} />
                 </CardContent>
              </Card>

              {/* Work Experience */}
              <Card>
                <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {workFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name={`workExperience.${index}.jobTitle`} render={({ field }) => (<FormItem><FormLabel>Job Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name={`workExperience.${index}.company`} render={({ field }) => (<FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <FormField control={form.control} name={`workExperience.${index}.location`} render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField control={form.control} name={`workExperience.${index}.startDate`} render={({ field }) => (<FormItem><FormLabel>Start Date</FormLabel><FormControl><Input {...field} placeholder="e.g., Jan 2020" /></FormControl><FormMessage /></FormItem>)} />
                             <FormField control={form.control} name={`workExperience.${index}.endDate`} render={({ field }) => (<FormItem><FormLabel>End Date</FormLabel><FormControl><Input {...field} placeholder="e.g., Present" /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <FormField control={form.control} name={`workExperience.${index}.responsibilities`} render={() => (
                           <FormItem><FormLabel>Key Responsibilities / Achievements</FormLabel>
                                <FormControl>
                                    <Textarea {...form.register(`workExperience.${index}.responsibilities.0`)} placeholder="Describe your main achievement in this role. Use action verbs and quantify results if possible." />
                                </FormControl>
                           <FormMessage /></FormItem>
                        )} />

                       {workFields.length > 1 && (<Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeWork(index)}><Trash2 className="h-4 w-4" /></Button>)}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendWork({ jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [''] })}><PlusCircle className="mr-2 h-4 w-4" /> Add Experience</Button>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader><CardTitle>Education</CardTitle></CardHeader>
                 <CardContent className="space-y-6">
                  {eduFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => (<FormItem><FormLabel>Degree / Certificate</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name={`education.${index}.institution`} render={({ field }) => (<FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name={`education.${index}.location`} render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name={`education.${index}.graduationDate`} render={({ field }) => (<FormItem><FormLabel>Graduation Date</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        {eduFields.length > 1 && (<Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeEdu(index)}><Trash2 className="h-4 w-4" /></Button>)}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendEdu({ degree: '', institution: '', location: '', graduationDate: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Education</Button>
                </CardContent>
              </Card>
              
               {/* Skills */}
              <Card>
                <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {skillFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-center">
                            <FormField control={form.control} name={`skills.${index}`} render={({ field }) => (
                                <FormItem className="flex-grow"><FormControl><Input {...field} placeholder="e.g., JavaScript, React, Node.js" /></FormControl><FormMessage /></FormItem>
                            )} />
                            {skillFields.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                        </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" onClick={() => appendSkill('')}><PlusCircle className="mr-2 h-4 w-4" /> Add Skill</Button>
                </CardContent>
              </Card>


              <Button type="submit" size="lg" className="w-full" disabled={isGenerating}>
                {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Wand2 className="mr-2 h-4 w-4" /> Build My Resume</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card className="mt-12">
            <CardHeader>
                <CardTitle>AI Generated Resume & Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-semibold mb-2">Resume Preview (Markdown)</h3>
                    <div className="relative">
                         <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md h-[70vh] overflow-y-auto bg-muted/20">
                            <ReactMarkdown>{result.resumeMarkdown}</ReactMarkdown>
                         </div>
                         <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={copyToClipboard}>
                           {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                         </Button>
                    </div>
                </div>
                 <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-400" /> AI Suggestions</h3>
                    <ul className="space-y-3 list-disc list-inside text-muted-foreground bg-muted/20 p-4 rounded-md">
                        {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                 </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
