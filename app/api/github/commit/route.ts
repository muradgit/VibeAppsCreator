import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { createSupabaseAdminClient } from '@/lib/supabase/client';
import { decryptToken } from '@/lib/utils';
import { createOctokitClient } from '@/lib/github/client';
import { commitFilesToRepo } from '@/lib/github/commit';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { projectId, taskId, files, commitMessage } = await req.json();
    const supabase = createSupabaseAdminClient();
    const { data: project } = await supabase.from('projects').select('github_repo, github_token_encrypted').eq('id', projectId).single();

    if (!project?.github_repo || !project?.github_token_encrypted) {
        return NextResponse.json({ error: 'GitHub not connected.' }, { status: 400 });
    }

    const [owner, repo] = project.github_repo.split('/');
    const githubToken = decryptToken(project.github_token_encrypted);
    const octokit = createOctokitClient(githubToken);

    try {
        const commitSha = await commitFilesToRepo(octokit, owner, repo, files, commitMessage);
        await supabase.from('tasks').update({ github_commit_sha: commitSha, status: 'done' }).eq('id', taskId);
        return NextResponse.json({ commitSha });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
