import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { supabase } from "@/lib/supabase/client";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await (supabase as any)
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.code === 'PGRST116' ? 404 : 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Allowed fields to update
    const { idea_refined, plan, tech_stack, constraints, status, github_repo, vercel_project_id } = body;
    
    const updateData: any = {};
    if (idea_refined !== undefined) updateData.idea_refined = idea_refined;
    if (plan !== undefined) updateData.plan = plan;
    if (tech_stack !== undefined) updateData.tech_stack = tech_stack;
    if (constraints !== undefined) updateData.constraints = constraints;
    if (status !== undefined) updateData.status = status;
    if (github_repo !== undefined) updateData.github_repo = github_repo;
    if (vercel_project_id !== undefined) updateData.vercel_project_id = vercel_project_id;

    const { data, error } = await (supabase as any)
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
