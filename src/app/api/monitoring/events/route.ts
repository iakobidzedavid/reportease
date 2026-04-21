import { NextRequest, NextResponse } from 'next/server';

interface MonitoringEvent {
  id: string;
  type: 'form_submission' | 'oauth_success' | 'oauth_failure' | 'data_pull' | 'error';
  status: 'success' | 'failure';
  duration: number;
  timestamp: string;
  details: Record<string, any>;
}

// In-memory event store
const events: MonitoringEvent[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, status, duration, details } = body;

    if (!type || !status || duration === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: type, status, duration',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const event: MonitoringEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type as MonitoringEvent['type'],
      status: status as MonitoringEvent['status'],
      duration: Number(duration),
      timestamp: new Date().toISOString(),
      details: details || {},
    };

    events.push(event);

    // Keep only last 1000 events in memory
    if (events.length > 1000) {
      events.shift();
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Event logged successfully',
        eventId: event.id,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error logging monitoring event:', error);
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

export async function GET(request: NextRequest) {
  try {
    const eventType = request.nextUrl.searchParams.get('type');
    const limit = Math.min(Number(request.nextUrl.searchParams.get('limit')) || 100, 1000);

    let filtered = events;
    if (eventType) {
      filtered = events.filter((e) => e.type === eventType);
    }

    const sliced = filtered.slice(-limit);

    // Calculate metrics
    const successCount = sliced.filter((e) => e.status === 'success').length;
    const failureCount = sliced.filter((e) => e.status === 'failure').length;
    const avgDuration =
      sliced.length > 0 ? sliced.reduce((sum, e) => sum + e.duration, 0) / sliced.length : 0;

    return NextResponse.json(
      {
        success: true,
        events: sliced,
        metrics: {
          totalEvents: sliced.length,
          successCount,
          failureCount,
          successRate: sliced.length > 0 ? ((successCount / sliced.length) * 100).toFixed(1) : 'N/A',
          avgDurationMs: avgDuration.toFixed(2),
        },
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
