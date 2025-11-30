import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  delay?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, id, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export const GlassCard: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = "", title }) => {
  return (
    <div className={`glass-card rounded-2xl p-6 transition-all duration-300 hover:transform hover:-translate-y-1 neon-glow 
      bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-none
      ${className}`}>
      {title && <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">{title}</h3>}
      {children}
    </div>
  );
};

export const NeonButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }> = ({ children, className = "", variant = 'primary', ...props }) => {
  const baseClasses = "relative px-6 py-3 rounded-xl font-semibold overflow-hidden transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer";
  const variants = {
    primary: "bg-gradient-to-r from-neonBlue to-blue-600 text-slate-900 hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] focus:ring-neonBlue",
    secondary: "bg-transparent border border-neonPurple text-neonPurple dark:text-white hover:bg-neonPurple/10 hover:shadow-[0_0_15px_rgba(188,19,254,0.3)] focus:ring-neonPurple"
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10 flex items-center justify-center gap-2 pointer-events-none">{children}</span>
    </button>
  );
};

export const InputGroup: React.FC<{ label: string; id: string; type?: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string, min?: string, max?: string }> = ({ label, id, type = "text", value, onChange, placeholder, min, max }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-neonBlue focus:border-transparent outline-none transition-all placeholder-gray-500"
    />
  </div>
);

export const CursorGlow: React.FC = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed z-50 transition-transform duration-75 ease-out hidden md:block pointer-events-none"
      style={{
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        transform: `translate(${pos.x}px, ${pos.y}px)`
      }}
    >
      <div className="w-[400px] h-[400px] bg-neonBlue/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 mix-blend-screen pointer-events-none"></div>
      <div className="w-4 h-4 bg-slate-900 dark:bg-white rounded-full mix-blend-difference absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
    </div>
  );
};

export const BackToTop: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-40 p-3 rounded-full bg-neonPurple text-white shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-neonPurple/50 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <ArrowUp size={24} />
    </button>
  );
};