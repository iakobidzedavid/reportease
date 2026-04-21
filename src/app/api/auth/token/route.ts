import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json();

    if (!code) {
      console.error('[AUTH_TOKEN] Missing authorization code', {
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { message: 'Missing authorization code' },
        { status: 400 }
      );
    }

    // In production, this would exchange the code for tokens
    // using the Google OAuth 2.0 token endpoint
    // POST https://oauth2.googleapis.com/token
    
    console.log('[AUTH_TOKEN] Token exchange initiated', {
      code: '***REDACTED***',
      state: state ? '***REDACTED***' : null,
      timestamp: new Date().toISOString(),
    });

    // Mock token response (in production, exchange code for real tokens)
    const tokens = {
      accessToken: 'ya29.a0AfH6SMBz...' + Math.random().toString(36).substring(7),
      refreshToken: 'MOCK_REFRESH_TOKEN_' + Date.now(),
      userId: 'user_' + Math.random().toString(36).substring(7),
      email: 'test@reportease.io',
      expiresIn: 3600,
    };

    console.log('[AUTH_TOKEN] Token exchange successful', {
      userId: tokens.userId,
      email: tokens.email,
      expiresIn: tokens.expiresIn,
      timestamp: new Date().toISOString(),
    });

    // Set secure httpOnly cookie with refresh token (in production)
    const response = NextResponse.json(tokens, { status: 200 });
    
    // In production, set secure httpOnly cookie:
    // response.cookies.set('refreshToken', tokens.refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'lax',
    //   maxAge: 30 * 24 * 60 * 60, // 30 days
    // });

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Token exchange failed';

    console.error('[AUTH_TOKEN] Error exchanging token', {
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
