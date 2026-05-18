"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.fallback) return this.fallback;
      
      return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[400px] w-full bg-white rounded-3xl border-2 border-dashed border-red-100 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Logic Loop Interruption</h3>
            <p className="text-slate-500 text-sm font-medium">
              We encountered an unexpected error processing this section. The system state remains secure.
            </p>
            {this.state.error && (
              <pre className="mt-4 p-4 bg-slate-50 rounded-lg text-[10px] text-red-600 font-mono text-left overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <Button 
            onClick={() => this.setState({ hasError: false })}
            variant="outline" 
            className="border-red-100 hover:bg-red-50 text-red-600 font-bold"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset Module
          </Button>
        </div>
      );
    }

    return this.props.children;
  }

  private fallback = this.props.fallback;
}
