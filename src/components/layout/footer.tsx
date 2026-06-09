
import Link from 'next/link';
import { BrandLogo } from '../icons/BrandLogo';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-24 border-t border-white/5 bg-background/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 mb-24">
            <div className="md:col-span-6">
              <div className="flex items-center gap-4 mb-10 group cursor-default">
                <BrandLogo className="w-12 h-12" />
                <span className="text-2xl font-black tracking-tighter uppercase">Francis Legacy</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-12 italic font-medium">
                "Evolution is the only constant. We build the tools that ensure your legacy keeps pace with the machine."
              </p>
              <div className="flex gap-10">
                <Github className="w-5 h-5 text-slate-600 hover:text-white transition-colors cursor-pointer" />
                <Twitter className="w-5 h-5 text-slate-600 hover:text-primary transition-colors cursor-pointer" />
                <Linkedin className="w-5 h-5 text-slate-600 hover:text-blue-500 transition-colors cursor-pointer" />
              </div>
            </div>

            <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Navigation</h5>
                <ul className="space-y-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <li className="hover:text-primary cursor-pointer transition-colors"><Link href="/">Core_Node</Link></li>
                  <li className="hover:text-primary cursor-pointer transition-colors"><Link href="/products">Registry</Link></li>
                  <li className="hover:text-primary cursor-pointer transition-colors"><Link href="/contact">Protocol</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Legal</h5>
                <ul className="space-y-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <li className="hover:text-primary cursor-pointer transition-colors"><Link href="/privacy-policy">Privacy_Terms</Link></li>
                  <li className="hover:text-primary cursor-pointer transition-colors">Kernel_License</li>
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
              © {currentYear} Francis Legacy AI — Production_Release_v4.0.2
            </div>
            <div className="flex gap-10 text-[9px] font-mono text-slate-700 uppercase tracking-[0.2em]">
              <Link href="/privacy-policy" className="hover:text-white cursor-pointer transition-colors">Privacy_Terms</Link>
              <span className="hover:text-white cursor-pointer transition-colors">Kernel_License</span>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
