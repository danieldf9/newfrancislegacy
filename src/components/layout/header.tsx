
'use client';

import Link from 'next/link';
import { Bot, Code, FileUp, Menu, Settings, TestTube, User, ChevronDown, HeartPulse, TrendingUp, Info, Phone, ShieldCheck, MonitorSmartphone, ChefHat, Dumbbell, Sparkles, FileText, Image as ImageIcon, Trophy, Mic, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BrandLogo } from '../icons/BrandLogo';
import { Separator } from '@/components/ui/separator';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const mainNavLinks = [
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
  
  const aiProductLinks = [
    { href: "/culinary-assistant", label: "Culinary Assistant", icon: ChefHat },
    { href: "/ai-health", label: "AI Health Planner", icon: HeartPulse },
    { href: "/daily-workout", label: "Daily Workout", icon: Dumbbell },
    { href: "/investment-advisor", label: "Investment Advisor", icon: TrendingUp },
    { href: "/cybersecurity-analyzer", label: "Security Center", icon: ShieldCheck },
    { href: "/ai-image-generation", label: "Image Generation", icon: ImageIcon },
  ];

  const interviewCrackerLinks = [
    { href: "/interview-cracker", label: "Dashboard", icon: Trophy },
    { href: "/interview-cracker/materials", label: "Prep Materials", icon: BookOpen },
    { href: "/interview-cracker/mock-interviews", label: "Mock Interviews", icon: Mic },
    { href: "/interview-cracker/resume-builder", label: "Resume Builder", icon: FileText },
    { href: "/interview-cracker/coding-challenges", label: "Coding Challenges", icon: Code },
  ];

  const qaToolsLinks = [
    { href: "/qa-test-assistant", label: "Dashboard", icon: TestTube },
    { href: "/qa-test-assistant/document-importer", label: "Document Importer", icon: FileUp },
    { href: "/qa-test-assistant/standalone-generator", label: "Standalone Generator", icon: Sparkles },
    { href: "/qa-test-assistant/playwright-generator", label: "Playwright Generator", icon: Bot },
    { href: "/qa-test-assistant/visual-tester", label: "Visual Tester", icon: MonitorSmartphone },
    { href: "/qa-test-assistant/playwright-setup", label: "Playwright Setup", icon: Code },
    { href: "/qa-test-assistant/setup", label: "Jira Setup", icon: Settings },
  ]

  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link href={href} className="group relative text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">
        {children}
        <span className={cn(
            "absolute -bottom-1 left-0 h-px bg-primary transition-all group-hover:w-full",
            pathname === href ? 'w-full' : 'w-0'
        )} />
    </Link>
  );

  const NavDropdown = ({ label, links, activeCondition }: { label: string, links: {href: string, label: string, icon: React.ElementType}[], activeCondition: boolean }) => (
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
                "group relative text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors flex items-center gap-1",
                activeCondition && "text-white"
            )}>
                {label}
                <ChevronDown className="w-3 h-3 transition-transform group-data-[state=open]:rotate-180" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 bg-black/80 border-white/10 backdrop-blur-xl text-slate-200">
            {links.map(link => (
                <DropdownMenuItem key={link.href} asChild className="cursor-pointer hover:bg-primary/10">
                     <Link href={link.href} className={cn("flex items-center w-full", pathname === link.href && "text-primary")}>
                        <link.icon className="mr-2 h-4 w-4"/>
                        {link.label}
                    </Link>
                </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
      </DropdownMenu>
  );


  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-2xl border-b border-white/5 py-3">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-4 group cursor-pointer">
            <BrandLogo />
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white uppercase leading-none">Francis</span>
              <span className="text-[10px] font-bold tracking-[0.4em] text-slate-500 uppercase opacity-80 group-hover:text-primary transition-colors">Legacy AI</span>
            </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-10'>
            {mainNavLinks.map(link => <NavLink key={link.href} href={link.href}>{link.label}</NavLink>)}
            <NavDropdown label="AI Assistants" links={aiProductLinks} activeCondition={aiProductLinks.some(l => pathname.startsWith(l.href))} />
            <NavDropdown label="Interview Cracker" links={interviewCrackerLinks} activeCondition={pathname.startsWith('/interview-cracker')} />
            <NavDropdown label="QA Tools" links={qaToolsLinks} activeCondition={pathname.startsWith('/qa-test-assistant')} />
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex items-center justify-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-xs">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/80 border-white/10 backdrop-blur-xl text-slate-200">
                <DropdownMenuLabel>Hi, {user.name}!</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10"/>
                <DropdownMenuItem onClick={logout} className="cursor-pointer hover:bg-primary/10">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className={cn(buttonVariants({variant: "ghost"}), "text-slate-300 hover:text-white hover:bg-white/5")}>
                    Login
                </Link>
                 <Link href="/signup" className={cn(buttonVariants({variant: "default"}), "bg-primary text-black font-bold hover:bg-primary/80")}>
                    Sign Up
                </Link>
            </div>
          )}

          {/* Mobile Navigation Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                    <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background border-r-white/10 w-[280px] sm:w-full">
                 <SheetHeader className="p-4 text-left border-b border-white/10">
                    <SheetTitle>
                        <Link href="/" className="flex items-center gap-2 text-xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                            <BrandLogo className="h-8 w-8 text-primary" />
                            <span>Francis Legacy</span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full py-4">
                    <nav className="flex flex-col gap-1 px-4">
                        {[...mainNavLinks, ...aiProductLinks, ...interviewCrackerLinks, ...qaToolsLinks].map(link => (
                            <SheetClose asChild key={link.href}>
                                <Link href={link.href} className={cn("text-lg font-medium hover:text-foreground py-2 rounded-md px-2", pathname.startsWith(link.href) ? "text-foreground bg-white/5" : "text-muted-foreground")}>{link.label}</Link>
                            </SheetClose>
                        ))}
                    </nav>
                    <div className="mt-auto px-4">
                        <Separator className="my-4 bg-white/10"/>
                        {user ? (
                             <div className="space-y-4">
                                <p className="font-semibold px-2">Hi, {user.name}!</p>
                                <Button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full">
                                  Logout
                                </Button>
                             </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <SheetClose asChild>
                                  <Button asChild variant="outline" className="w-full"><Link href="/login">Login</Link></Button>
                                </SheetClose>
                                <SheetClose asChild>
                                  <Button asChild className="w-full"><Link href="/signup">Sign Up</Link></Button>
                                </SheetClose>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
