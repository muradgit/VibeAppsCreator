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
    <nav className="h-[60px] bg-white flex items-center justify-between px-4 md:px-6 border-b border-purple-100 shrink-0 z-50 sticky top-0 shadow-sm">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 md:hidden text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <Link href="/" className="flex items-center gap-3 font-bold text-slate-900 tracking-tight text-lg">
          <div className="w-8 h-8 md:w-8 md:h-8 bg-primary rounded flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
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
                <span className="text-[10px] text-purple-600 uppercase font-black tracking-tighter">Authenticated</span>
                <span className="text-sm text-slate-900 font-bold">{session.user?.name}</span>
            </div>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-primary hover:bg-purple-50 h-9 px-2 md:px-3">
                <LayoutDashboard className="md:mr-2 h-4 w-4" /> 
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => signOut()}
                className="border-purple-100 text-slate-600 hover:bg-purple-50 hover:text-primary h-9 px-2 md:px-3"
            >
              <LogOut className="md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold ring-2 ring-purple-100 shadow-lg shadow-purple-500/10">
                {session.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </div>
          </>
        ) : (
          <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 h-9 shadow-lg shadow-purple-500/20" asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
