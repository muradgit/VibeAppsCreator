import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { createSupabaseAdminClient } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as any)?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, idea } = await req.json();
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from('projects').insert({
      user_id: (session.user as any).id,
      name,
      idea_raw: idea,
      status: 'idea',
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from('projects').select('*').eq('user_id', (session.user as any).id).order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
