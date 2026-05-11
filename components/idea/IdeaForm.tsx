"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";

const ideaFormSchema = z.object({
  idea: z.string().min(50, { message: "Your idea must be at least 50 characters long." }),
  name: z.string().min(3, { message: "Project name must be at least 3 characters long." }),
});

export function IdeaForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof ideaFormSchema>>({
    resolver: zodResolver(ideaFormSchema),
    defaultValues: { idea: "", name: "" },
  });

  const onSubmit = async (values: z.infer<typeof ideaFormSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to create project.');
      
      const project = await response.json();
      toast.success("Project created! Starting analysis...");
      router.push(`/project/${project.id}/analysis`);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Describe Your App Idea</CardTitle>
        <CardDescription>We&apos;ll use Gemini to analyze your concept and build a plan.</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Project Name</label>
            <input 
                {...form.register("name")} 
                className="w-full p-2 border border-slate-700 rounded-md bg-slate-800 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
            />
            {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-300">Detailed Concept</label>
            <Textarea
              placeholder="e.g., A task management app for professional chefs that uses voice recognition..."
              className="min-h-[200px] bg-slate-800 border-slate-700 text-white"
              {...form.register("idea")}
            />
             {form.formState.errors.idea && <p className="text-red-500 text-xs">{form.formState.errors.idea.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "Creating..." : "Next: AI Analysis"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
