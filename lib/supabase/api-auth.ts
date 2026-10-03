import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

export async function withAuthenticatedApiUser(
  request: NextRequest,
  handler: (user: User) => Promise<NextResponse>
): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  const applyAuthCookies = (response: NextResponse) => {
    for (const cookie of supabaseResponse.cookies.getAll()) {
      response.cookies.set(cookie);
    }
    return response;
  };

  let user: User | null = null;
  let authError: Error & { status?: number } | null = null;

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });

            supabaseResponse = NextResponse.next({ request });

            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const result = await supabase.auth.getUser();
    user = result.data.user;
    authError = result.error;
  } catch (error: unknown) {
    console.error('Supabase API authentication error:', error);
    return applyAuthCookies(
      NextResponse.json(
        { success: false, error: 'Unable to verify authentication at this time.' },
        { status: 503 }
      )
    );
  }

  if (!user) {
    const status = authError?.status && authError.status >= 500 ? 503 : 401;
    return applyAuthCookies(
      NextResponse.json(
        {
          success: false,
          error:
            status === 401
              ? 'Authentication required.'
              : 'Unable to verify authentication at this time.',
        },
        { status }
      )
    );
  }

  return applyAuthCookies(await handler(user));
}
