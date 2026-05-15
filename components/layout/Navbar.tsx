"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, Code, Package, Menu, X } from "lucide-react";
import { useProjectStore } from "@/store/project.store";

export function Navbar() {
  const { data: session } = useSession();
  const { isSidebarOpen, setSidebarOpen } = useProjectStore();

  return (
    <nav className="h-[60px] bg-[#0F172A] flex items-center justify-between px-4 md:px-6 border-b border-white/10 shrink-0 z-50">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 md:hidden text-slate-300 hover:text-white"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <Link href="/" className="flex items-center gap-3 font-bold text-white tracking-tight text-lg">
          <div className="w-8 h-8 md:w-8 md:h-8 bg-blue-600 rounded flex items-center justify-center shrink-0">
              <Code className="w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:inline">Apps Built By Apps</span>
          <span className="sm:hidden">ABBA</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        {session ? (
          <>
            <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Authenticated</span>
                <span className="text-sm text-white font-medium">{session.user?.name}</span>
            </div>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/5 h-9 px-2 md:px-3">
                <LayoutDashboard className="md:mr-2 h-4 w-4" /> 
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => signOut()}
                className="bg-white/10 text-white border-white/10 hover:bg-white/20 h-9 px-2 md:px-3"
            >
              <LogOut className="md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10">
                {session.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </div>
          </>
        ) : (
          <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 h-9" asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
