import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for MVP (would be replaced with actual database)
const leadsDatabase: Array<{
  id: string;
  email: string;
  company: string;
  fullName: string;
  createdAt: string;
  source: string;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    const { email, company, fullName } = body;

    if (!email || !company || !fullName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: email, company, fullName',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Create lead record
    const lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email.toLowerCase(),
      company: company.trim(),
      fullName: fullName.trim(),
      createdAt: new Date().toISOString(),
      source: request.headers.get('referer') || 'direct',
    };

    // Store in in-memory database
    leadsDatabase.push(lead);

    return NextResponse.json(
      {
        success: true,
        message: 'Lead submitted successfully',
        leadId: lead.id,
        data: lead,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing lead submission:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json(
      {
        success: true,
        data: leadsDatabase,
        count: leadsDatabase.length,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
