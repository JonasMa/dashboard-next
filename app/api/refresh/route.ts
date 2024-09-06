import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST() {
  try {
    revalidateTag('weather');
    revalidateTag('todos');
    revalidateTag('notion');
    
    return NextResponse.json({ message: 'Cache cleared and data refreshed' });
  } catch (error) {
    console.error('Failed to refresh data:', error);
    return NextResponse.json({ error: 'Failed to refresh data' }, { status: 500 });
  }
}