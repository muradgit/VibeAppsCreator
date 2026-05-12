import { Card, CardContent } from "@/components/ui/card";
import { InlineQuestion } from "./InlineQuestion";
import { Cpu } from "lucide-react";

interface TechStackCardProps {
  name: string;
  rationale: string;
  projectId: string;
}

export function TechStackCard({ name, rationale, projectId }: TechStackCardProps) {
  return (
    <Card className="border-white/5 bg-slate-900/40 relative group overflow-hidden">
      <div className="absolute top-0 right-0 p-3">
        <InlineQuestion itemText={`${name}: ${rationale}`} projectId={projectId} />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
           <Cpu className="h-4 w-4 text-blue-400" />
           <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase tracking-widest">
                {name}
           </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
            {rationale}
        </p>
      </CardContent>
    </Card>
  );
}
