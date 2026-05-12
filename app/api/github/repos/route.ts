import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getOctokitClient } from "@/lib/github/client";
import { decryptToken } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  const { data: project } = await supabase.from("projects").select("github_token_encrypted").eq("id", projectId).single();
  if (!project?.github_token_encrypted) return NextResponse.json({ error: "GitHub not connected" }, { status: 400 });

  try {
    const token = decryptToken(project.github_token_encrypted);
    const octokit = getOctokitClient(token);
    
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 50
    });
    
    return NextResponse.json(repos.map(r => ({ id: r.id, name: r.name, full_name: r.full_name, private: r.private })));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
