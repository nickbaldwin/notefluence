import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client for server-side operations with service role key
// Note: You'll need to add SUPABASE_SERVICE_ROLE_KEY to your .env.local
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query parameter (frontend will pass this)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log('API GET - User ID from query:', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Fetch both user's own projects AND public projects from other users
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        pages_count:pages(count),
        activities_count:activities(count)
      `)
      .or(`owner_id.eq.${userId},is_public.eq.true`)
      .order('created_at', { ascending: false });

    console.log('API GET - Projects found:', projects?.length, 'Error:', error);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(projects || []);
  } catch (error) {
    console.error('API GET - Exception:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...projectData } = body;
    
    console.log('API POST - User ID:', userId, 'Project data:', projectData);
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        title: projectData.title,
        description: projectData.description,
        slug: projectData.title.toLowerCase().replace(/\s+/g, '-'),
        is_public: projectData.isPublic || false,
        owner_id: userId
      }])
      .select()
      .single();

    console.log('API POST - Created project:', data?.title, 'Error:', error);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API POST - Exception:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
