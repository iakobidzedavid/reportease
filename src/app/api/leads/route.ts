import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Type definitions
interface Lead {
  id: string;
  email: string;
  name: string;
  company: string;
  timestamp: string;
  source: string;
}

interface LeadsDatabase {
  leads: Lead[];
  lastUpdated: string;
}

interface ValidationError {
  field: string;
  message: string;
}

// Constants
const LEADS_FILE_PATH = path.join(process.cwd(), 'documents', 'leads.json');
const MAX_LEADS_PER_EMAIL = 1; // Prevent duplicate signups from same email
const DUPLICATE_CHECK_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

// Ensure leads directory exists
const ensureLeadsDirectory = () => {
  const dir = path.dirname(LEADS_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Load existing leads from file
const loadLeads = (): LeadsDatabase => {
  try {
    ensureLeadsDirectory();
    if (fs.existsSync(LEADS_FILE_PATH)) {
      const data = fs.readFileSync(LEADS_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading leads:', error);
  }
  return { leads: [], lastUpdated: new Date().toISOString() };
};

// Save leads to file
const saveLeads = (database: LeadsDatabase): boolean => {
  try {
    ensureLeadsDirectory();
    
    // Create backup before writing
    if (fs.existsSync(LEADS_FILE_PATH)) {
      const backupPath = LEADS_FILE_PATH.replace('.json', `.backup.${Date.now()}.json`);
      fs.copyFileSync(LEADS_FILE_PATH, backupPath);
      
      // Clean up old backups (keep only last 5)
      const dir = path.dirname(LEADS_FILE_PATH);
      const files = fs.readdirSync(dir)
        .filter(f => f.startsWith('leads.backup') && f.endsWith('.json'))
        .sort()
        .reverse();
      
      for (let i = 5; i < files.length; i++) {
        fs.unlinkSync(path.join(dir, files[i]));
      }
    }
    
    database.lastUpdated = new Date().toISOString();
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(database, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving leads:', error);
    return false;
  }
};

// Validation functions
const validateEmail = (email: string): boolean => {
  // RFC 5322 simplified pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const validateName = (name: string): boolean => {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
};

const validateCompany = (company: string): boolean => {
  const trimmed = company.trim();
  return trimmed.length >= 2 && trimmed.length <= 150;
};

// Sanitize input (prevent XSS)
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 1000); // Limit length
};

// Generate unique lead ID
const generateLeadId = (): string => {
  return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Check for duplicate leads
const checkForDuplicate = (email: string, database: LeadsDatabase): boolean => {
  const now = Date.now();
  return database.leads.some(lead => {
    const leadTime = new Date(lead.timestamp).getTime();
    const timeDiff = now - leadTime;
    return lead.email.toLowerCase() === email.toLowerCase() 
      && timeDiff < DUPLICATE_CHECK_WINDOW_MS;
  });
};

// Main POST handler
export async function POST(request: NextRequest) {
  try {
    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Extract and sanitize fields
    const email = sanitizeInput(body.email || '');
    const name = sanitizeInput(body.name || '');
    const company = sanitizeInput(body.company || '');

    // Validation checks
    const validationErrors: ValidationError[] = [];

    if (!email) {
      validationErrors.push({ field: 'email', message: 'Email is required' });
    } else if (!validateEmail(email)) {
      validationErrors.push({ field: 'email', message: 'Invalid email format' });
    }

    if (!name) {
      validationErrors.push({ field: 'name', message: 'Name is required' });
    } else if (!validateName(name)) {
      validationErrors.push({ field: 'name', message: 'Name must be 2-100 characters' });
    }

    if (!company) {
      validationErrors.push({ field: 'company', message: 'Company is required' });
    } else if (!validateCompany(company)) {
      validationErrors.push({ field: 'company', message: 'Company must be 2-150 characters' });
    }

    // Return first validation error
    if (validationErrors.length > 0) {
      const error = validationErrors[0];
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          field: error.field,
        },
        { status: 400 }
      );
    }

    // Load existing leads
    const database = loadLeads();

    // Check for duplicates
    if (checkForDuplicate(email, database)) {
      return NextResponse.json(
        {
          success: false,
          error: 'This email address has already been registered. Please check your inbox for our welcome email.',
          field: 'email',
        },
        { status: 400 }
      );
    }

    // Create new lead
    const newLead: Lead = {
      id: generateLeadId(),
      email: email.toLowerCase(),
      name: name.trim(),
      company: company.trim(),
      timestamp: new Date().toISOString(),
      source: request.headers.get('referer') || 'direct',
    };

    // Add to database
    database.leads.push(newLead);

    // Save to file
    if (!saveLeads(database)) {
      return NextResponse.json(
        { success: false, error: 'Failed to save your information. Please try again.' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        leadId: newLead.id,
        timestamp: newLead.timestamp,
        message: 'Thank you for signing up! Check your email for next steps.',
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error in POST /api/leads:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Our team has been notified. Please try again.',
      },
      { status: 500 }
    );
  }
}

// GET handler for debugging (optional, remove in production)
export async function GET(request: NextRequest) {
  // Only allow if running locally
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  }

  try {
    const database = loadLeads();
    return NextResponse.json({
      totalLeads: database.leads.length,
      lastUpdated: database.lastUpdated,
      leads: database.leads.slice(-10), // Return last 10 for debugging
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load leads' },
      { status: 500 }
    );
  }
}
