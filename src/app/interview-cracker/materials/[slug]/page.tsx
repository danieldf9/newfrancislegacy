import { materials } from '@/lib/interview-materials';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface MaterialPageProps {
  params: {
    slug: string;
  };
}

export default function MaterialPage({ params }: MaterialPageProps) {
  const material = materials.find(m => m.slug === params.slug);

  if (!material) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
        <Button asChild variant="outline" className="mb-8">
            <Link href="/interview-cracker/materials">
                &larr; Back to Materials
            </Link>
        </Button>
      <Card>
        <CardHeader>
          <Badge variant="secondary" className="w-fit mb-2">{material.category}</Badge>
          <CardTitle className="text-3xl md:text-4xl">{material.title}</CardTitle>
          <CardDescription className="text-lg">{material.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <article className="prose prose-invert max-w-none">
            <ReactMarkdown>{material.content}</ReactMarkdown>
          </article>
        </CardContent>
      </Card>
    </div>
  );
}
