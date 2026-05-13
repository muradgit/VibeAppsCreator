import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export default async function ProjectEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  const { data: project } = await (supabase as any)
    .from("projects")
    .select("status")
    .eq("id", id)
    .single();

  if (!project) {
    redirect("/dashboard");
  }

  // Redirect to correct phase
  switch (project.status) {
    case "idea":
      redirect(`/project/${id}/analysis`);
    case "planning":
      redirect(`/project/${id}/plan`);
    case "building":
      redirect(`/project/${id}/tasks`);
    default:
      redirect(`/project/${id}/analysis`);
  }
}
