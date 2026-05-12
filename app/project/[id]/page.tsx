import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export default async function ProjectEntryPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  const { data: project } = await supabase
    .from("projects")
    .select("status")
    .eq("id", params.id)
    .single();

  if (!project) {
    redirect("/dashboard");
  }

  // Redirect to correct phase
  switch (project.status) {
    case "idea":
      redirect(`/project/${params.id}/analysis`);
    case "planning":
      redirect(`/project/${params.id}/plan`);
    case "building":
      redirect(`/project/${params.id}/tasks`);
    default:
      redirect(`/project/${params.id}/analysis`);
  }
}
