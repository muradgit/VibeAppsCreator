import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { VercelClient } from "@/lib/vercel/client";
import { encryptToken } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { token, projectId } = await req.json();
    const client = new VercelClient(token);
    
    // Validate token
    await client.getProjects();
    
    const encryptedToken = encryptToken(token);
    
    await (supabase as any).from("projects").update({
      vercel_token_encrypted: encryptedToken
    }).eq("id", projectId).eq("user_id", session.user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
