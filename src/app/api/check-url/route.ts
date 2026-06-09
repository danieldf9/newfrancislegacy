
'use server';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    
    let normalizedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
        normalizedUrl = `https://${url}`;
    }
    
    // Use a HEAD request to efficiently get headers without downloading the full body
    const response = await axios.head(normalizedUrl, {
        timeout: 8000, // Generous timeout
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });
    
    const headers = response.headers;
    const xFrameOptions = headers['x-frame-options'] || '';
    const csp = headers['content-security-policy'] || '';

    // Check for headers that would prevent framing
    const canBeFramed = !(
      xFrameOptions.toLowerCase() === 'deny' ||
      xFrameOptions.toLowerCase() === 'sameorigin' ||
      csp.toLowerCase().includes("frame-ancestors 'none'") ||
      csp.toLowerCase().includes("frame-ancestors 'self'")
    );

    return NextResponse.json({ canBeFramed });

  } catch (error: any) {
     // If an error occurs (e.g., timeout, DNS error, or the site returns an error code),
     // we assume it cannot be reliably framed and default to false.
    console.warn(`Could not check headers for ${error.config?.url}: ${error.message}. Defaulting to no-iframe.`);
    return NextResponse.json({ canBeFramed: false });
  }
}