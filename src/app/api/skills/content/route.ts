import { NextRequest, NextResponse } from 'next/server';
import { fetchSkillContent } from '@/lib/github';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  const path = searchParams.get('path');

  if (!owner || !repo || !path) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const content = await fetchSkillContent(owner, repo, path);
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching skill content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
