import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code, Zap, Shield, Cpu, ArrowRight, Github } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest animate-fade-in">
                <Zap className="w-3 h-3 fill-current" />
                <span>The Future of Software Development</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                Ship Full-Stack Apps <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                    Driven by Intelligence.
                </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Apps Built By Apps is a professional-grade AI workflow that automates analysis, planning, and high-fidelity code generation for complex applications.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-8 text-base font-bold shadow-xl shadow-blue-600/20" asChild>
                    <Link href="/dashboard">
                        Start Building Now <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold border-white/10 hover:bg-white/5 transition-all text-white">
                    <Github className="mr-2 w-5 h-5" /> View on GitHub
                </Button>
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 border-t border-white/5 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={Cpu} 
                    title="AI-Guided Logic" 
                    description="Our engine analyzes your requirements and constructs a multi-step plan before a single line of code is written."
                />
                <FeatureCard 
                    icon={Shield} 
                    title="Code Integrity" 
                    description="Every piece of code is reviewed by a separate AI instance for security, performance, and style consistency."
                />
                <FeatureCard 
                    icon={Code} 
                    title="Production Ready" 
                    description="We generate clean, modular, and typed code using modern frameworks like Next.js, Tailwind, and Supabase."
                />
            </div>
        </div>
      </section>

      {/* Social Proof / Trust */}
      <section className="py-16 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-8">Trusted by builders from around the world</p>
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-40 grayscale">
            <span className="text-xl font-bold italic tracking-tighter">Velocity Labs</span>
            <span className="text-xl font-bold tracking-tight">Cortex Systems</span>
            <span className="text-xl font-black">STRIKE</span>
            <span className="text-xl font-medium font-serif italic tracking-wide">Lumina</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 font-bold text-white tracking-tight">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <Code className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Apps Built By Apps</span>
            </div>
            <div className="flex gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
                <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
            </div>
            <p className="text-xs text-slate-600">© 2026 ABBA AI Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="p-8 rounded-3xl bg-slate-800/40 border border-white/5 hover:border-blue-500/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        </div>
    )
}
