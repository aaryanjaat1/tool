import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Mail, Linkedin, Sun, Moon } from 'lucide-react';
import { AnimatedSection, NeonButton, CursorGlow, BackToTop } from './components/UI';
import { BMICalculator, EMICalculator, AgeCalculator, GSTCalculator, QRGenerator, PasswordGenerator } from './components/Calculators';

// --- Loading Screen ---
const Loader: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 1500);

    return () => {
      clearInterval(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center">
      <div className="text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neonBlue to-neonPurple animate-pulse mb-8">
        TOOLCRAFT AI
      </div>
      <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neonBlue to-neonPurple transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 text-slate-500 font-mono text-sm">{progress}% INITIALIZING</div>
    </div>
  );
};

// --- Navbar ---
interface NavbarProps {
  toggleTheme: () => void;
  isDark: boolean;
  onNavigate: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleTheme, isDark, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Tools', id: 'tools' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    onNavigate(id);
  }

  return (
    <nav className={`fixed top-0 w-full z-[60] transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neonBlue to-neonPurple flex items-center justify-center text-slate-900 font-black">T</div>
          ToolCraft<span className="text-neonBlue">.ai</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          {links.map(link => (
            <button 
              key={link.name} 
              onClick={() => handleNavClick(link.id)} 
              className="text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium tracking-wide cursor-pointer relative group bg-transparent border-none"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neonBlue transition-all group-hover:w-full"></span>
            </button>
          ))}
          
          <button 
             onClick={toggleTheme}
             className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:scale-110 transition-transform"
          >
             {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            onClick={() => handleNavClick('tools')}
            className="px-4 py-2 rounded-full border border-neonBlue/50 text-neonBlue text-xs font-bold uppercase tracking-wider hover:bg-neonBlue/10 transition-all cursor-pointer"
          >
            Start Now
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
           <button 
             onClick={toggleTheme}
             className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white z-[70]"
           >
             {isDark ? <Sun size={18} /> : <Moon size={18} />}
           </button>
           <button className="text-slate-900 dark:text-white cursor-pointer z-[70]" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-64' : 'max-h-0'}`}>
        <div className="flex flex-col p-6 space-y-4">
          {links.map(link => (
            <button key={link.name} onClick={() => handleNavClick(link.id)} className="text-left text-slate-600 dark:text-gray-300 hover:text-neonBlue cursor-pointer bg-transparent border-none font-medium">
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// --- Main App ---
export default function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return <Loader onFinish={() => setLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white selection:bg-neonBlue selection:text-slate-900 relative transition-colors duration-300">
      <CursorGlow />
      <Navbar toggleTheme={toggleTheme} isDark={theme === 'dark'} onNavigate={scrollToSection} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neonPurple/10 dark:bg-neonPurple/20 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[0%] right-[-10%] w-[500px] h-[500px] bg-neonBlue/10 dark:bg-neonBlue/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <AnimatedSection>
            <span className="inline-block py-1 px-3 rounded-full bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-neonBlue text-xs font-bold tracking-widest mb-6 backdrop-blur-sm shadow-sm dark:shadow-none">
              PREMIUM UTILITIES SUITE
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
              Tools for the <span className="neon-text-gradient">Modern Era</span>
            </h1>
            <p className="text-slate-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              A collection of beautifully designed calculators and generators. fast, responsive, and easy to use.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NeonButton onClick={() => scrollToSection('tools')}>Explore Tools</NeonButton>
              <NeonButton variant="secondary" onClick={() => scrollToSection('about')}>Learn More</NeonButton>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section id="tools" className="py-20 px-6 relative z-10">
        <div className="container mx-auto">
          <AnimatedSection className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Our <span className="text-neonBlue">Toolkit</span></h2>
            <div className="w-20 h-1 bg-gradient-to-r from-neonBlue to-neonPurple mx-auto rounded-full"></div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedSection delay={0}><BMICalculator /></AnimatedSection>
            <AnimatedSection delay={100}><EMICalculator /></AnimatedSection>
            <AnimatedSection delay={200}><AgeCalculator /></AnimatedSection>
            <AnimatedSection delay={300}><GSTCalculator /></AnimatedSection>
            <AnimatedSection delay={400}><QRGenerator /></AnimatedSection>
            <AnimatedSection delay={500}><PasswordGenerator /></AnimatedSection>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-slate-100 dark:bg-slate-900/50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-200 dark:to-slate-900 pointer-events-none"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <AnimatedSection className="w-full md:w-1/2">
               <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-neonBlue to-neonPurple rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                 <div className="relative rounded-2xl bg-white dark:bg-slate-800 p-8 ring-1 ring-slate-200 dark:ring-white/10 leading-none shadow-xl dark:shadow-none">
                    <div className="space-y-4 text-center py-12">
                       <h3 className="text-4xl font-bold text-slate-900 dark:text-white">10k+</h3>
                       <p className="text-slate-500 dark:text-gray-400">Daily Calculations</p>
                       <div className="h-px bg-slate-200 dark:bg-white/10 w-1/2 mx-auto my-4"></div>
                       <h3 className="text-4xl font-bold text-slate-900 dark:text-white">99.9%</h3>
                       <p className="text-slate-500 dark:text-gray-400">Uptime Accuracy</p>
                    </div>
                 </div>
               </div>
            </AnimatedSection>
            <AnimatedSection className="w-full md:w-1/2" delay={200}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">About <span className="text-neonPurple">ToolCraft</span></h2>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-6">
                We believe utility tools shouldn't just be functional—they should be beautiful. ToolCraft AI combines precise mathematical logic with high-end glassmorphism design to provide a superior user experience.
              </p>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                Whether you're calculating finances, checking health metrics, or generating secure data, our tools are optimized for speed, privacy, and visual delight.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
           <AnimatedSection className="text-center mb-12">
             <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Get in <span className="text-green-500 dark:text-green-400">Touch</span></h2>
             <p className="text-slate-500 dark:text-gray-400">Have a suggestion for a new tool? We'd love to hear from you.</p>
           </AnimatedSection>

           <AnimatedSection delay={200}>
             <form className="glass-card p-8 rounded-2xl space-y-6 bg-white dark:bg-slate-800" onSubmit={(e) => e.preventDefault()}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Name</label>
                   <input type="text" className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-neonBlue outline-none text-slate-900 dark:text-white" placeholder="John Doe" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Email</label>
                   <input type="email" className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-neonBlue outline-none text-slate-900 dark:text-white" placeholder="john@example.com" />
                 </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Message</label>
                  <textarea rows={4} className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-neonBlue outline-none text-slate-900 dark:text-white" placeholder="I want a currency converter..."></textarea>
               </div>
               <NeonButton className="w-full md:w-auto">Send Message</NeonButton>
             </form>
           </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/5 pt-12 pb-6 px-6 transition-colors duration-300">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-4 md:mb-0">
               <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">ToolCraft<span className="text-neonBlue">.ai</span></span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors"><Github size={20} /></a>
              <a href="#" className="text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors"><Mail size={20} /></a>
            </div>
          </div>
          <div className="text-center text-slate-500 dark:text-gray-600 text-sm border-t border-slate-200 dark:border-white/5 pt-6">
            © {new Date().getFullYear()} ToolCraft AI. All rights reserved.
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}