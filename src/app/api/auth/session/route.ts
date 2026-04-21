import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { accessToken, refreshToken, userId, email } = await request.json();

    if (!accessToken || !userId) {
      return NextResponse.json(
        { message: 'Missing required session parameters' },
        { status: 400 }
      );
    }

    console.log('[AUTH_SESSION] Creating session', {
      userId,
      email,
      timestamp: new Date().toISOString(),
    });

    // In production, store session in Redis or database
    // Session structure:
    // {
    //   userId,
    //   email,
    //   accessToken,
    //   refreshToken,
    //   createdAt: Date.now(),
    //   expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
    // }

    const session = {
      id: 'sess_' + Math.random().toString(36).substring(7),
      userId,
      email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    console.log('[AUTH_SESSION] Session created successfully', {
      sessionId: session.id,
      userId,
      expiresAt: session.expiresAt,
      timestamp: new Date().toISOString(),
    });

    const response = NextResponse.json(session, { status: 200 });

    // Set session cookie
    response.cookies.set('sessionId', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Session creation failed';

    console.error('[AUTH_SESSION] Error creating session', {
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
