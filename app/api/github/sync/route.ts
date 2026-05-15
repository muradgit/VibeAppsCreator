import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { fetchRepoContents } from "@/lib/github/sync";
import { decryptToken } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await req.json();

  const { data: project } = await (supabase as any).from("projects").select("*").eq("id", projectId).single();

  if (!project?.github_token_encrypted || !project.github_repo) {
    return NextResponse.json({ error: "GitHub not configured for this project" }, { status: 400 });
  }

  try {
    const token = decryptToken(project.github_token_encrypted);
    const [owner, repo] = project.github_repo.split("/");

    const files = await fetchRepoContents({
      token,
      owner,
      repo
    });

    // We can store these files as a "snapshot" or update a task
    // For now, let's just return them and maybe log that we synced
    
    // Optional: Update the most recent task's generated_code if it matches?
    // Or add a special "Sync" task.
    // For simplicity, let's just return success and the user can see them in the UI if we add a viewer.

    return NextResponse.json({ success: true, fileCount: Object.keys(files).length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
