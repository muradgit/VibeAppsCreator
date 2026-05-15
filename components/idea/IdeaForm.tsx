"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2, Rocket } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ideaSchema = z.object({
  idea: z.string().min(50, "Please describe your idea with at least 50 characters.").max(2000),
});

export function IdeaForm() {
  const router = useRouter();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(ideaSchema),
    defaultValues: { idea: "" }
  });

  const ideaText = watch("idea");

  const onSubmit = async (values: z.infer<typeof ideaSchema>) => {
    setIsSubmitting(true);
    try {
      // Auto-generate name from first few words
      const name = values.idea.split(" ").slice(0, 6).join(" ");
      
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, idea_raw: values.idea })
      });

      if (!res.ok) throw new Error("Failed to create project");
      const project = await res.json();
      
      router.push(`/project/${project.id}/analysis`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const enhanceIdea = async () => {
    if (ideaText.length < 50) {
      toast.error("Please provide a more detailed base idea first (min 50 chars)");
      return;
    }
    setIsEnhancing(true);
    try {
        const res = await fetch("/api/gemini/enhance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ideaRaw: ideaText }) 
        });
        if (!res.ok) throw new Error("Enhancement failed");
        const data = await res.json();
        setValue("idea", data.enhanced);
        toast.success("Idea enhanced by AI");
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        setIsEnhancing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-2xl mx-auto">
      <Card className="border-purple-100 bg-white shadow-2xl shadow-purple-500/5">
        <CardContent className="p-6 space-y-4">
          <div className="relative">
            <Textarea
              {...register("idea")}
              placeholder="E.g. A marketplace for tech gadgets with AI product categorization..."
              className="min-h-[200px] bg-purple-50/30 border-purple-100 text-slate-900 p-4 focus:ring-primary rounded-xl resize-none font-medium placeholder:text-slate-400"
            />
            <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {ideaText.length} / 2000
            </div>
          </div>
          {errors.idea && (
            <p className="text-xs text-rose-500 font-bold">{errors.idea.message}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={enhanceIdea}
              disabled={isEnhancing || isSubmitting}
              className="flex-1 border-purple-100 bg-white hover:bg-purple-50 text-slate-600 font-bold h-12 md:h-14"
            >
              {isEnhancing ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" /> : <Sparkles className="mr-2 h-4 w-4 text-primary" />}
              Enhance my idea
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isEnhancing}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-black h-12 md:h-14 shadow-lg shadow-purple-500/20"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
              Initialize Build
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-center text-xs text-slate-500 font-medium">
        Our AI engine will analyze your vision and construct a professional development roadmap.
      </p>
    </form>
  );
}
