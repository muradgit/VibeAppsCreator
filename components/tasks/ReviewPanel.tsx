import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeReview } from "@/types";

interface ReviewPanelProps {
  review: CodeReview;
  onCommit?: () => void;
  onRegenerate?: () => void;
  isProcessing?: boolean;
}

export function ReviewPanel({ review, onCommit, onRegenerate, isProcessing }: ReviewPanelProps) {
  const isPass = review.score >= 90;

  return (
    <Card className={cn(
        "border-2 overflow-hidden",
        isPass ? "border-emerald-500/20 bg-emerald-500/5" : "border-rose-500/20 bg-rose-500/5"
    )}>
      <div className={cn(
        "p-4 flex items-center justify-between",
        isPass ? "bg-emerald-500/10" : "bg-rose-500/10"
      )}>
        <div className="flex items-center gap-3">
            {isPass ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <AlertTriangle className="h-6 w-6 text-rose-500" />}
            <div>
                <h3 className={cn("text-lg font-black tracking-tight", isPass ? "text-emerald-700" : "text-rose-700")}>
                    Security & Logic Audit: {review.score}%
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Automated Review Verdict</p>
            </div>
        </div>
        <span className={cn(
            "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest",
            isPass ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
        )}>
            {review.status === 'done' ? 'PASSED' : 'ACTION REQUIRED'}
        </span>
      </div>

      <CardContent className="p-6 space-y-6">
        <p className="text-sm font-medium text-slate-700 leading-relaxed italic border-l-4 pl-4 border-slate-200">
            "{review.verdict}"
        </p>

        {review.issues.length > 0 && (
            <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detected issues</h4>
                <div className="space-y-2">
                    {review.issues.map((issue, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white border border-slate-200 flex gap-3 text-xs">
                            <AlertCircle className={cn(
                                "h-4 w-4 shrink-0 mt-0.5",
                                issue.severity === 'critical' || issue.severity === 'high' ? 'text-rose-500' : 'text-amber-500'
                            )} />
                            <div className="space-y-1">
                                <p className="font-bold text-slate-900">{issue.problem} <span className="text-[10px] opacity-40">@{issue.location}</span></p>
                                <p className="text-slate-500 leading-relaxed font-medium">Fix: {issue.fix}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed criteria</h4>
                <div className="flex flex-wrap gap-2">
                    {review.completedCriteria.map((c, i) => (
                        <span key={i} className="px-2 py-1 bg-white border rounded text-[10px] font-bold text-slate-600 uppercase">
                            ✓ {c}
                        </span>
                    ))}
                </div>
            </div>
            {review.missingRequirements.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Missing elements</h4>
                    <div className="flex flex-wrap gap-2">
                        {review.missingRequirements.map((c, i) => (
                            <span key={i} className="px-2 py-1 bg-rose-50 border border-rose-100 rounded text-[10px] font-bold text-rose-600 uppercase">
                                ✗ {c}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {(onCommit || onRegenerate) && (
            <div className="flex gap-3 pt-4 border-t">
                {isPass ? (
                    <Button 
                        disabled={isProcessing} 
                        onClick={onCommit}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 shadow-lg shadow-emerald-600/20"
                    >
                        {isProcessing ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ShieldCheck className="h-5 w-5 mr-2" />}
                        Deploy to GitHub
                    </Button>
                ) : (
                    <Button 
                        disabled={isProcessing} 
                        onClick={onRegenerate}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black h-12 shadow-lg shadow-rose-600/20"
                    >
                         {isProcessing ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Request AI Refinement"}
                    </Button>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
