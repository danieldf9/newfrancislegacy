
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  Terminal, 
  ChefHat, 
  HeartPulse, 
  TrendingUp, 
  ShieldCheck, 
  Menu, 
  X, 
  ArrowRight,
  Zap,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Database,
  Activity
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';

// Custom Reveal Hook with Scale support
const useReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible] as const;
};

const RevealSection = ({ children, className = "", delay = 0 }: {children: React.ReactNode, className?: string, delay?: number}) => {
  const [ref, isVisible] = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${className} transition-all duration-[1200ms] cubic-bezier(0.2, 0.8, 0.2, 1) transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-[0.98]'
      }`}
    >
      {children}
    </div>
  );
};

const BrandLogo = ({ className = "w-10 h-10", glow = true }: {className?: string, glow?: boolean}) => (
  <div className={`relative ${className} group`}>
    {glow && (
      <div className="absolute -inset-2 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    )}
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="w-full h-full drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
    >
      <path 
        d="M50 5L90 25V75L50 95L10 75V25L50 5Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        className="text-white/20"
      />
      <path 
        d="M50 12L82 28V72L50 88L18 72V28L50 12Z" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeDasharray="4 4"
        className="text-cyan-500/30"
      />
      
      <path 
        d="M35 35H65M35 50H55M35 35V70" 
        stroke="white" 
        strokeWidth="6" 
        strokeLinecap="round" 
        className="group-hover:stroke-cyan-400 transition-colors"
      />
      
      <circle cx="65" cy="35" r="3" fill="#22d3ee" className="animate-pulse" />
      <circle cx="55" cy="50" r="3" fill="#22d3ee" style={{ animationDelay: '0.5s' }} className="animate-pulse" />
      <circle cx="35" cy="70" r="3" fill="#22d3ee" style={{ animationDelay: '1s' }} className="animate-pulse" />
      
      <path d="M10 25L25 15" stroke="#22d3ee" strokeWidth="1" opacity="0.5" />
      <path d="M90 75L75 85" stroke="#22d3ee" strokeWidth="1" opacity="0.5" />
    </svg>
  </div>
);

const NeuralParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-500/20 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float-particle ${10 + Math.random() * 20}s linear infinite`,
            animationDelay: `-${Math.random() * 20}s`
          }}
        />
      ))}
    </div>
  );
};

export default function HomePage() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const products = [
    {
      title: 'QA Test Assistant',
      description: 'Generate test cases, draft bug reports, and create Playwright code directly from Jira tickets.',
      icon: <Terminal className="w-6 h-6 text-cyan-400" />,
      tag: 'Flagship AI',
      color: 'from-cyan-500/20 to-blue-600/20',
      accent: 'cyan',
      href: '/qa-test-assistant'
    },
    {
      title: 'Culinary Assistant',
      description: 'Conversational chef for recipe ideas and step-by-step cooking guidance.',
      icon: <ChefHat className="w-6 h-6 text-orange-400" />,
      color: 'from-orange-500/20 to-red-600/20',
      accent: 'orange',
      href: '/culinary-assistant'
    },
    {
      title: 'AI Health Planner',
      description: 'Personalized meal plans and dietary advice driven by your health data.',
      icon: <HeartPulse className="w-6 h-6 text-rose-400" />,
      color: 'from-rose-500/20 to-pink-600/20',
      accent: 'rose',
      href: '/ai-health'
    },
    {
      title: 'Investment Advisor',
      description: 'Tailored Indian market portfolios based on your unique financial goals.',
      icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-600/20',
      accent: 'emerald',
      href: '/investment-advisor'
    },
    {
      title: 'Security Center',
      description: 'Gmail scanning and text analysis for proactive threat detection.',
      icon: <ShieldCheck className="w-6 h-6 text-indigo-400" />,
      color: 'from-indigo-500/20 to-purple-600/20',
      accent: 'indigo',
      href: '/cybersecurity-analyzer'
    }
  ];

  return (
    <div className="min-h-screen bg-[#010206] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Global Overlays */}
      <div className="noise-overlay" />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.05), transparent 40%)`}} />
        <div className="absolute inset-0 cyber-grid opacity-30" style={{ animation: 'grid-flow 15s linear infinite' }} />
        <NeuralParticles />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? 'bg-black/80 backdrop-blur-2xl border-b border-white/5 py-3' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4 group cursor-pointer">
            <BrandLogo />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white uppercase leading-none">Francis</span>
              <span className="text-[10px] font-bold tracking-[0.4em] text-slate-500 uppercase opacity-80 group-hover:text-cyan-400 transition-colors">Legacy AI</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-12">
            {['Products', 'About', 'Contact'].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="group relative text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyan-500 transition-all group-hover:w-full" />
              </Link>
            ))}
             <Link href={user ? "/qa-test-assistant" : "/login"} passHref>
              <button className="relative px-7 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95 group overflow-hidden">
                <span className="relative z-10">Access Terminal</span>
                <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </Link>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 lg:pt-64 lg:pb-40 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <RevealSection className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-xl mb-10 group cursor-default">
              <Activity className="w-3 h-3 text-cyan-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 group-hover:text-cyan-400 transition-colors">Neural Link Established</span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter mb-10 leading-[0.85] text-white">
              AUTOMATING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30">INTELLIGENCE.</span>
            </h1>

            <p className="max-w-2xl text-slate-500 text-base sm:text-lg lg:text-xl mb-14 font-medium leading-relaxed">
              We build specialized AI nodes that integrate into your daily workflow, 
              transforming manual effort into automated legacy.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
                <Link href={user ? "/qa-test-assistant" : "/login"} passHref>
                    <button className="group relative px-12 py-5 bg-cyan-500 text-black font-black uppercase tracking-widest text-xs overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                        <span className="relative z-10 flex items-center gap-2">Initialize System <ChevronRight className="w-4 h-4" /></span>
                    </button>
                </Link>
                <Link href="/about" passHref>
                    <button className="px-12 py-5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all backdrop-blur-sm">
                        Documentation
                    </button>
                </Link>
            </div>
          </RevealSection>

          <RevealSection delay={400} className="mt-32 relative max-w-5xl mx-auto">
            <div 
              className="relative rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 bg-[#050810]/40 backdrop-blur-3xl p-2 sm:p-3 shadow-2xl overflow-hidden"
              style={{ animation: 'float-hero 8s ease-in-out infinite' }}
            >
              <div className="bg-[#020408] rounded-[1.5rem] sm:rounded-[2rem] border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 border-b border-white/5 bg-white/[0.01]">
                  <div className="flex gap-2 sm:gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                  </div>
                  <div className="text-[8px] sm:text-[10px] font-mono text-slate-600 tracking-[0.2em] sm:tracking-[0.3em] uppercase text-center">LEGACY_KERNEL</div>
                  <Globe className="w-4 h-4 text-slate-700" style={{animation: 'spin-slow 20s linear infinite'}}/>
                </div>
                
                <div className="grid lg:grid-cols-12">
                  <div className="lg:col-span-5 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-white/5">
                    <div className="flex items-center gap-3 mb-8 text-cyan-400">
                      <Zap className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Active Processing</span>
                    </div>
                    <div className="space-y-8">
                      {[
                        { label: 'Neural Weight', val: 94 },
                        { label: 'Sync Rate', val: 82 },
                        { label: 'Uptime', val: 100 }
                      ].map((s, i) => (
                        <div key={i} className="space-y-3">
                          <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                            <span>{s.label}</span>
                            <span className="text-cyan-500">{s.val}%</span>
                          </div>
                          <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000" 
                              style={{ width: `${s.val}%`, transitionDelay: `${800 + i * 200}ms` }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-7 p-6 sm:p-10 font-mono text-xs text-cyan-400/70 bg-black/60 relative">
                    <div className="mb-4 text-slate-600 flex items-center gap-2">
                      <span className="text-emerald-500">●</span> root@francis_legacy: ~/apps/qa-agent
                    </div>
                    <div className="space-y-2">
                      <div className="text-emerald-400">&gt; legacy --init --flagship</div>
                      <div className="text-white/40 italic">// Injecting Jira ticket context...</div>
                      <div className="text-cyan-400/90">Generating Playwright Spec [100%]</div>
                      <div className="text-slate-500 mt-6">
                        <span className="text-purple-400">test</span>('User Flow', <span className="text-purple-400">async</span> () ={'>'} {'{'} <br />
                        &nbsp;&nbsp;<span className="text-blue-400">await</span> page.goto('/dashboard'); <br />
                        &nbsp;&nbsp;<span className="text-blue-400">await</span> expect(page).toHaveTitle(/Legacy/); <br />
                        {'}'});
                      </div>
                      <div className="mt-8 flex gap-4">
                        <span className="px-2 py-0.5 border border-cyan-500/30 text-[9px] rounded">DEPLOYED</span>
                        <span className="px-2 py-0.5 border border-white/10 text-[9px] rounded text-slate-600">JIRA_REF_042</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Product Suite */}
      <section id="products" className="py-40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <RevealSection className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase mb-6">Neural Grid</h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                Autonomous nodes designed for specific lifestyle and development challenges. 
                Optimized for performance and human-centric interaction.
              </p>
            </div>
            <div className="hidden md:block h-px flex-1 bg-white/5 mx-12 mb-4" />
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500">System v4.0.2</span>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <Link href={products[0].href} passHref className="md:col-span-8">
              <div className="group relative rounded-[2rem] sm:rounded-[3rem] bg-slate-900/10 border border-white/5 p-8 sm:p-12 md:p-16 overflow-hidden transition-all duration-700 hover:bg-slate-900/20 cursor-pointer h-full">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="border-beam-line" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                      {products[0].icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">{products[0].tag}</span>
                      <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">{products[0].title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-slate-400 text-base sm:text-lg lg:text-xl max-w-lg mb-12 leading-relaxed font-medium">
                    {products[0].description}
                  </p>
                  
                  <div className="flex items-center gap-5 text-white font-black uppercase tracking-[0.2em] text-[10px] group/btn">
                    <span className="px-6 py-3 border border-white/10 rounded-full group-hover/btn:border-cyan-500/50 transition-all">Launch AI Terminal</span>
                    <ArrowRight className="w-5 h-5 text-cyan-500 group-hover/btn:translate-x-3 transition-transform" />
                  </div>
                </div>
                
                <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                  <Database className="w-80 h-80" />
                </div>
              </div>
            </Link>

            <div className="md:col-span-4 space-y-8">
              {products.slice(1, 3).map((p, i) => (
                <RevealSection key={i} delay={i * 150}>
                    <Link href={p.href} passHref>
                        <div className="group p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white/[0.01] border border-white/5 hover:border-cyan-500/20 hover:bg-white/[0.03] transition-all cursor-pointer h-full">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-8 transition-transform group-hover:scale-110`}>
                                {p.icon}
                            </div>
                            <h4 className="text-2xl font-black text-white uppercase mb-4 tracking-tight">{p.title}</h4>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed">{p.description}</p>
                            <div className="w-8 h-px bg-white/10 group-hover:w-16 transition-all group-hover:bg-cyan-500" />
                        </div>
                    </Link>
                </RevealSection>
              ))}
            </div>

            {products.slice(3).map((p, i) => (
              <RevealSection key={i} delay={i * 200} className="md:col-span-6">
                <Link href={p.href} passHref>
                    <div className="group p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all flex flex-col sm:flex-row gap-8 sm:gap-10 items-center cursor-pointer h-full">
                        <div className={`shrink-0 w-20 h-20 rounded-3xl bg-gradient-to-br ${p.color} flex items-center justify-center shadow-2xl`}>
                        {p.icon}
                        </div>
                        <div>
                        <h4 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-3">{p.title}</h4>
                        <p className="text-slate-500 mb-8 max-w-xs">{p.description}</p>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-cyan-400 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                            Accessing Agent_0{i+4}
                        </div>
                        </div>
                    </div>
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-white/5 bg-[#010206] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 mb-24">
            <div className="md:col-span-6">
              <div className="flex items-center gap-4 mb-10 group cursor-default">
                <BrandLogo className="w-12 h-12" />
                <span className="text-2xl font-black tracking-tighter uppercase">Francis Legacy</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed max-w-sm mb-12 italic font-medium">
                "Evolution is the only constant. We build the tools that ensure your legacy keeps pace with the machine."
              </p>
              <div className="flex gap-10">
                <Github className="w-5 h-5 text-slate-700 hover:text-white transition-colors cursor-pointer" />
                <Twitter className="w-5 h-5 text-slate-700 hover:text-cyan-400 transition-colors cursor-pointer" />
                <Linkedin className="w-5 h-5 text-slate-700 hover:text-blue-500 transition-colors cursor-pointer" />
              </div>
            </div>

            <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Navigation</h5>
                <ul className="space-y-5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                   <li className="hover:text-cyan-500 cursor-pointer transition-colors"><Link href="/">Core_Node</Link></li>
                  <li className="hover:text-cyan-500 cursor-pointer transition-colors"><Link href="/products">Registry</Link></li>
                  <li className="hover:text-cyan-500 cursor-pointer transition-colors"><Link href="/contact">Protocol</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Security</h5>
                <ul className="space-y-5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  <li className="hover:text-cyan-500 cursor-pointer transition-colors"><Link href="/about">Status_Map</Link></li>
                  <li className="hover:text-cyan-500 cursor-pointer transition-colors">Encryption</li>
                  <li className="hover:text-cyan-500 cursor-pointer transition-colors">Open_Source</li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h5 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Terminal</h5>
                <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-loose">
                  Bengaluru Sector<br />
                  Karnataka, IN<br />
                  Node_ID: 0x42F
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[9px] font-mono text-slate-700 uppercase tracking-[0.4em] text-center md:text-left">
              © {new Date().getFullYear()} Francis Legacy AI — Production_Release_v4.0.2
            </div>
            <div className="flex gap-10 text-[9px] font-mono text-slate-700 uppercase tracking-[0.2em]">
              <Link href="/privacy-policy" className="hover:text-white cursor-pointer transition-colors">Privacy_Terms</Link>
              <span className="hover:text-white cursor-pointer transition-colors">Kernel_License</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
