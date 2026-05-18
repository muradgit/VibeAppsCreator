"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, Code, Package, Menu, X, User } from "lucide-react";
import { useProjectStore } from "@/store/project.store";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const { isSidebarOpen, setSidebarOpen } = useProjectStore();

  return (
    <nav className="h-[60px] bg-white flex items-center justify-between px-4 md:px-6 border-b border-purple-100 shrink-0 z-50 sticky top-0 shadow-sm">
      <div className="flex items-center gap-3 md:gap-4">
        {session && (
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 -ml-2 text-primary hover:bg-purple-50 rounded-xl transition-colors md:hidden"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}
        <Link href="/" className="flex items-center gap-2 md:gap-3 font-bold text-slate-900 tracking-tight text-base md:text-lg group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Code className="w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:inline">Apps Built By Apps</span>
          <span className="sm:hidden font-black">ABBA</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        {session ? (
          <>
            <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-[9px] text-primary uppercase font-black tracking-widest">Authenticated Account</span>
                <span className="text-xs text-slate-800 font-bold">{session.user?.name}</span>
            </div>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-primary hover:bg-purple-50 h-9 px-2 md:px-3 rounded-lg overflow-hidden">
                <LayoutDashboard className="md:mr-2 h-4 w-4" /> 
                <span className="hidden md:inline">Console</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2 pl-2 border-l border-purple-50">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-purple-100 flex items-center justify-center text-primary text-xs font-black shadow-inner overflow-hidden shrink-0">
                    {session.user?.image ? (
                         <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        session.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || <User className="h-4 w-4" />
                    )}
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => signOut()}
                    className="hidden sm:flex border-purple-50 text-[10px] uppercase tracking-widest font-black text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 h-8 px-3 rounded-lg transition-all"
                >
                    <LogOut className="mr-2 h-3.5 w-3.5" />
                    Sign Out
                </Button>
            </div>
          </>
        ) : (
          <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 h-9 px-6 rounded-lg text-xs font-black shadow-xl shadow-purple-500/20 uppercase tracking-widest transition-all hover:scale-105 active:scale-95" asChild>
            <Link href="/dashboard">Initialize</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
