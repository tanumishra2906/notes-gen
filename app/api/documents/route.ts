import { NextRequest, NextResponse } from 'next/server';
import { withAuthenticatedApiUser } from '@/lib/supabase/api-auth';

export async function GET(request: NextRequest) {
  return withAuthenticatedApiUser(request, async (user, supabase) => {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('id, title, source_filename, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load user documents:', error);
      return NextResponse.json(
        { success: false, error: 'Could not load your study documents.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          documents,
        },
      },
      { status: 200 }
    );
  });
}
