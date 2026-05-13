import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getOctokitClient } from "@/lib/github/client";
import { encryptToken } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { token, projectId } = await req.json();
    const octokit = getOctokitClient(token);
    
    // Validate token
    const { data: user } = await octokit.users.getAuthenticated();
    
    const encryptedToken = encryptToken(token);
    
    await (supabase as any).from("projects").update({
      github_token_encrypted: encryptedToken
    }).eq("id", projectId).eq("user_id", session.user.id);

    return NextResponse.json({ success: true, login: user.login });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
