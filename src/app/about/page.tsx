
import Image from 'next/image';
import { Bot, Zap } from 'lucide-react';
import { RevealSection } from '@/components/layout/RevealSection';

export default function AboutPage() {
  return (
    <div className="relative z-10 pt-24 pb-40">
      <div className="container mx-auto px-8">
        <RevealSection className="text-center space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white">
                INTELLIGENT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30">BY DESIGN.</span>
            </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            At Francis Legacy, we are dedicated to building cutting-edge AI assistants that streamline complex workflows and empower users in their daily tasks, from the professional to the personal.
          </p>
        </RevealSection>
        
        <RevealSection delay={200} className="mt-24 relative aspect-video w-full rounded-3xl border border-white/10 overflow-hidden p-1 bg-gradient-to-b from-white/5 to-transparent">
          <Image 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
            alt="AI and data analytics dashboard"
            fill={true}
            style={{objectFit: "cover"}}
            className="rounded-2xl"
            data-ai-hint="data analytics"
          />
        </RevealSection>

        <div className="mt-32 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <RevealSection>
                <h2 className="text-4xl font-black tracking-tighter text-white uppercase mb-6">From Idea to Intelligence</h2>
                <div className="text-slate-400 space-y-6 text-lg">
                  <p>
                    We believe in the power of artificial intelligence to solve real-world problems. Our journey is one of continuous innovation, transforming complex data into intuitive, actionable insights.
                  </p>
                  <p>
                    Our team is passionate about creating intelligent tools that are not only powerful but also accessible and easy to use. It's a commitment to quality and a difference you can feel in every interaction.
                  </p>
                </div>
              </RevealSection>
              <RevealSection delay={200} className="flex justify-center">
                <div className="relative w-64 h-64">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
                    <Bot className="w-full h-full text-primary/30" />
                    <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-primary animate-pulse" />
                </div>
              </RevealSection>
            </div>
        </div>
      </div>
    </div>
  );
}
