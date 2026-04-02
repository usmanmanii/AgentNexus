import { NextRequest, NextResponse } from 'next/server';
import { getAllSkills } from '@/lib/github';
import { AgentType } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    let skills = await getAllSkills();
    
    // Filtering logic if any queries exist
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const agentType = searchParams.get('agent') as AgentType | undefined;
    
    if (query) {
      const q = query.toLowerCase();
      skills = skills.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.owner.toLowerCase().includes(q)
      );
    }

    if (agentType && (agentType as string) !== 'all') {
      skills = skills.filter(s => s.agentTypes.includes(agentType));
    }

    return NextResponse.json({ skills, totalCount: skills.length });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch', skills: [] }, { status: 500 });
  }
}
