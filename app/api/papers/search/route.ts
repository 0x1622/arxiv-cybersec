import { NextResponse } from 'next/server';
import { searchPapers } from '@/lib/arxiv';
import type { SearchParams } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const params: SearchParams = {
    query: searchParams.get('q') || '',
    year: searchParams.get('year') || undefined,
    category: searchParams.get('category') || 'cs.CR', // Default to Cryptography and Security
    tag: searchParams.get('tag') || undefined,
    page: parseInt(searchParams.get('page') || '1', 10),
  };

  try {
    const results = await searchPapers(params);
    return NextResponse.json(results);
  } catch (error) {
    console.error('API Error fetching papers:', error);
    return NextResponse.json(
      { message: 'Failed to fetch papers', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 