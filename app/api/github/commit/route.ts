import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { commitFilesToGitHub } from "@/lib/github/commit";
import { decryptToken } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { taskId, projectId } = await req.json();

  const { data: project } = await (supabase as any).from("projects").select("*").eq("id", projectId).single();
  const { data: task } = await (supabase as any).from("tasks").select("*").eq("id", taskId).single();

  if (!project?.github_token_encrypted || !project.github_repo) {
    return NextResponse.json({ error: "GitHub not configured for this project" }, { status: 400 });
  }

  try {
    const token = decryptToken(project.github_token_encrypted);
    const [owner, repo] = project.github_repo.split("/");

    const files = Object.entries(task.generated_code as Record<string, string>).map(([path, content]) => ({
      path,
      content
    }));

    const result = await commitFilesToGitHub({
      token,
      owner,
      repo,
      files,
      commitMessage: `[ABBA] Task #${task.sequence_number}: ${task.title}`
    });

    const commitSha = result[0]?.sha || "unknown";

    await (supabase as any).from("tasks").update({
      github_commit_sha: commitSha,
      status: "done",
    }).eq("id", taskId);

    return NextResponse.json({ success: true, commitSha });
  } catch (error: any) {
    if (error.status === 403 || error.status === 429) {
      return NextResponse.json(
        { error: "GitHub rate limit reached. Please wait 60 seconds and try again.", rateLimited: true },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
