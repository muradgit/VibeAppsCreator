import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { supabase } from "@/lib/supabase/client";

export async function GET(req: Request, { params }: { params: Promise<{ id: string; taskId: string }> }) {
  const { id, taskId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: project } = await (supabase as any)
    .from("projects")
    .select("id")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data, error } = await (supabase as any)
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .eq("project_id", id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.code === "PGRST116" ? "Not found" : error.message },
      { status: error.code === "PGRST116" ? 404 : 500 }
    );
  }

  return NextResponse.json(data);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; taskId: string }> }) {
  const { id, taskId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: project } = await (supabase as any)
    .from("projects")
    .select("id")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await req.json();

    const { status, generated_prompt, generated_code, review_result, retry_count, github_commit_sha } = body;

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (generated_prompt !== undefined) updateData.generated_prompt = generated_prompt;
    if (generated_code !== undefined) updateData.generated_code = generated_code;
    if (review_result !== undefined) updateData.review_result = review_result;
    if (retry_count !== undefined) updateData.retry_count = retry_count;
    if (github_commit_sha !== undefined) updateData.github_commit_sha = github_commit_sha;

    const { data, error } = await (supabase as any)
      .from("tasks")
      .update(updateData)
      .eq("id", taskId)
      .eq("project_id", id)
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
