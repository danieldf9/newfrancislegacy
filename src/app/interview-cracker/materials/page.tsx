'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { materials } from '@/lib/interview-materials';
import { BookOpen, ArrowRight } from 'lucide-react';

const categories = ['All', 'Technical', 'Behavioral', 'System Design'] as const;
type Category = typeof categories[number];

export default function MaterialsPage() {
  const [activeTab, setActiveTab] = useState<Category>('All');

  const filteredMaterials = activeTab === 'All'
    ? materials
    : materials.filter(m => m.category === activeTab);

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <header className="text-center mb-12">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Preparation Materials
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Browse articles, tutorials, and frameworks to sharpen your skills for any interview.
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Category)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMaterials.map(material => (
            <Link href={`/interview-cracker/materials/${material.slug}`} key={material.slug} className="block group">
              <Card className="flex flex-col h-full hover:border-primary transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{material.title}</CardTitle>
                  </div>
                  <CardDescription className="pt-2">{material.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{material.category}</Badge>
                    <div className="flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
