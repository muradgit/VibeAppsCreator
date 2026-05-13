import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { VercelClient } from "@/lib/vercel/client";
import { decryptToken } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  const { data: project } = await supabase.from("projects").select("vercel_token_encrypted").eq("id", projectId).single();
  if (!project?.vercel_token_encrypted) return NextResponse.json({ error: "Vercel not connected" }, { status: 400 });

  try {
    const token = decryptToken(project.vercel_token_encrypted);
    const client = new VercelClient(token);
    const data = await client.getProjects();
    
    return NextResponse.json(data.projects.map((p: any) => ({ id: p.id, name: p.name })));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
