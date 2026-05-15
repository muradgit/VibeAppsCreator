import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code, Zap, Shield, Cpu, ArrowRight, Github } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 md:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
            <div className="absolute top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-fuchsia-600/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-xs font-black uppercase tracking-widest animate-fade-in">
                <Zap className="w-3 h-3 fill-current" />
                <span>The Future of Software Development</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-slate-900">
                Ship Full-Stack Apps <br className="hidden sm:block" /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-600">
                    Driven by Intelligence.
                </span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                Apps Built By Apps is a professional-grade AI workflow that automates analysis, planning, and high-fidelity code generation for complex applications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 h-12 md:h-14 px-8 text-base font-black shadow-xl shadow-purple-500/20" asChild>
                    <Link href="/dashboard">
                        Start Building Now <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 md:h-14 px-8 text-base font-bold border-purple-100 hover:bg-purple-50 transition-all text-slate-600">
                    <Github className="mr-2 w-5 h-5" /> View on GitHub
                </Button>
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 px-4 md:px-6 border-t border-purple-50 bg-purple-50/30 text-slate-900">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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

      {/* Social Proof */}
      <section className="py-16 border-t border-purple-50 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Trusted by builders from around the world</p>
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-40 grayscale contrast-125">
            <span className="text-xl font-bold italic tracking-tighter">Velocity Labs</span>
            <span className="text-xl font-bold tracking-tight">Cortex Systems</span>
            <span className="text-xl font-black">STRIKE</span>
            <span className="text-xl font-medium font-serif italic tracking-wide">Lumina</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 px-6 border-t border-purple-50 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 font-black text-slate-900 tracking-tight">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Code className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Apps Built By Apps</span>
            </div>
            <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">© 2026 ABBA AI Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="p-8 rounded-3xl bg-white border border-purple-50 hover:border-primary/30 hover:shadow-xl hover:shadow-purple-500/5 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{description}</p>
        </div>
    )
}
