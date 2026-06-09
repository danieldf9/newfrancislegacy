
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Sparkles, Image as ImageIcon, Download, AlertCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from 'next/image';
import { generateImage } from '@/ai/flows/generate-image-flow';
import type { GenerateImageInput } from '@/lib/schemas';

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export default function AiImageGenerationPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [prompt, setPrompt] = useState('A cinematic shot of an astronaut riding a horse on Mars, detailed, 4k');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isAuthLoading && !user) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'Please log in to access this page.' });
      router.push(`/login?redirect_to=${pathname}`);
    }
  }, [user, isAuthLoading, router, toast, pathname]);
  
  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        variant: 'destructive',
        title: 'Prompt is required',
        description: 'Please enter a prompt to generate an image.',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    setError(null);

    try {
      const input: GenerateImageInput = { prompt, aspectRatio };
      const data = await generateImage(input);
      setGeneratedImage(data.imageData);
      toast({
        title: 'Image Generated!',
        description: 'Your image has been successfully created.',
      });

    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: err.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `ai-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearImage = () => {
    setGeneratedImage(null);
  };

  if (isAuthLoading || !user) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
        <Card className="w-full shadow-xl">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                    <ImageIcon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl">AI Image Generation</CardTitle>
                <CardDescription>Create stunning visuals from text prompts using the Imagen 4 model.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="prompt-input">Your Prompt</Label>
                  <Textarea
                      id="prompt-input"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., A photo of a futuristic city with flying cars at sunset."
                      rows={3}
                      className="mt-1"
                      disabled={isGenerating}
                  />
                </div>
                
                 <div>
                    <Label>Aspect Ratio</Label>
                    <RadioGroup
                        value={aspectRatio}
                        onValueChange={(value) => setAspectRatio(value as AspectRatio)}
                        className="flex flex-wrap gap-4 mt-2"
                        disabled={isGenerating}
                    >
                        {(["1:1", "16:9", "9:16", "4:3", "3:4"] as AspectRatio[]).map((ratio) => (
                           <Label key={ratio} htmlFor={`r-${ratio}`} className="flex items-center gap-2 cursor-pointer rounded-md border p-2 px-3 hover:bg-accent has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-primary">
                                <RadioGroupItem value={ratio} id={`r-${ratio}`} />
                                {ratio}
                            </Label>
                        ))}
                    </RadioGroup>
                </div>

                <Button onClick={handleGenerate} disabled={isGenerating} size="lg" className="w-full">
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isGenerating ? 'Generating...' : 'Generate Image'}
                </Button>
            </CardContent>
        </Card>

        {isGenerating && (
             <div className="mt-8 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-96 bg-muted/50">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-semibold text-foreground">Generating your masterpiece...</p>
                <p className="text-muted-foreground text-sm">This usually takes about 10-15 seconds.</p>
            </div>
        )}

        {error && !isGenerating && (
             <Alert variant="destructive" className="mt-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Generation Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {generatedImage && !isGenerating && (
            <Card className="mt-8">
                 <CardHeader>
                    <CardTitle>Your Generated Image</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                         <Image src={generatedImage} alt="AI generated image" fill={true} style={{ objectFit: 'contain' }} />
                         <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/50 hover:bg-black/75 text-white" onClick={clearImage}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Clear image</span>
                         </Button>
                    </div>
                    <Button onClick={handleDownload} className="mt-4 w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Image
                    </Button>
                 </CardContent>
            </Card>
        )}

    </div>
  );
}
