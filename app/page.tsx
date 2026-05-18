import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code, Zap, Shield, Cpu, ArrowRight, Github, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto bg-white text-slate-900 selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-32 md:pb-48 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-0 left-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/5 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/3 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-fuchsia-600/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8 md:space-y-12">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.3em] animate-in fade-in slide-in-from-top-4 duration-1000">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>The Future of Software Synthesis</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1] text-slate-900 animate-in fade-in slide-in-from-top-8 duration-1000 delay-100">
                Ship Scalable Apps <br className="hidden sm:block" /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-fuchsia-600 px-2">
                    Driven by Logic.
                </span>
            </h1>
            
            <p className="text-base md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-top-12 duration-1000 delay-200">
                ABBA is a professional-grade AI workflow that automates analysis, planning, and high-fidelity code generation for mission-critical applications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-6 animate-in fade-in zoom-in-95 duration-1000 delay-300">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 h-14 md:h-16 px-10 md:px-12 text-base md:text-lg font-black shadow-2xl shadow-purple-500/30 rounded-2xl transition-all hover:scale-105 active:scale-95 group overflow-hidden relative" asChild>
                    <Link href="/dashboard">
                        <span className="relative z-10 flex items-center">Start Building <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 md:h-16 px-10 md:px-12 text-base md:text-lg font-bold border-purple-100 hover:bg-purple-50 transition-all text-slate-600 rounded-2xl">
                    <Github className="mr-3 w-5 h-5" /> Enterprise
                </Button>
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 md:py-32 px-6 border-t border-purple-50 bg-slate-50/50 text-slate-900">
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Proprietary Engine</h2>
                <h3 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">Advanced logic synthesis for the modern web.</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={Cpu} 
                    title="AI-Guided Architecture" 
                    description="Our engine analyzes your requirements and constructs a multi-step plan before a single line of code is written."
                />
                <FeatureCard 
                    icon={Shield} 
                    title="Code Integrity Review" 
                    description="Every piece of code is reviewed by a separate AI instance for security, performance, and style consistency."
                />
                <FeatureCard 
                    icon={Code} 
                    title="Production Execution" 
                    description="We generate clean, modular, and typed code using modern frameworks like Next.js, Tailwind, and Supabase."
                />
            </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-t border-purple-50 text-center bg-white">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-12">Architecting growth at global scale</p>
        <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-12 opacity-30 grayscale contrast-125">
            <span className="text-2xl font-black italic tracking-tighter">VELOCITY</span>
            <span className="text-2xl font-bold tracking-tight">CORTEX</span>
            <span className="text-2xl font-black">STRIKE.AI</span>
            <span className="text-2xl font-medium font-serif italic tracking-wide">LUMINA</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-16 md:py-24 px-8 border-t border-purple-50 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="flex items-center gap-3 font-black text-slate-900 tracking-tight text-xl">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-xl shadow-purple-500/20">
                    <Code className="w-5 h-5 text-white" />
                </div>
                <span>ABBA</span>
            </div>
            <div className="flex flex-wrap justify-center gap-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Security</a>
                <a href="#" className="hover:text-primary transition-colors">API Docs</a>
            </div>
            <div className="text-center md:text-right space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 ABBA Intelligence Inc.</p>
                <p className="text-[9px] text-slate-300 font-medium">Built with automated precision.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="p-10 rounded-[2.5rem] bg-white border border-purple-100 hover:border-primary/40 hover:shadow-2xl hover:shadow-purple-500/10 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -translate-y-12 translate-x-12 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                <Icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
            <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">{description}</p>
        </div>
    )
}
