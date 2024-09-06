import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const NOTION_KEY = process.env.NOTION_API_KEY;
const PAGE_ID = process.env.NOTION_PAGE_ID;
const CACHE_DURATION = 60 * 60; // 1 hour

const notion = new Client({ auth: NOTION_KEY });

export async function GET() {
  try {
    const blocks = await notion.blocks.children.list({
      block_id: PAGE_ID as string,
      page_size: 50,
    });

    const formattedBlocks = blocks.results.map((block: any) => {
      if (block.type === 'paragraph') {
        return {
          id: block.id,
          type: block.type,
          content: block.paragraph.rich_text.map((text: any) => text.plain_text).join(''),
        };
      }
      if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
        return {
          id: block.id,
          type: block.type,
          content: block[block.type].rich_text[0].plain_text,
        };
      }
      // Add more block types as needed
      return null;
    }).filter(Boolean);

    const cachedResponse = NextResponse.json(formattedBlocks);
    cachedResponse.headers.set('Cache-Control', `s-maxage=${CACHE_DURATION}, stale-while-revalidate`);
    return cachedResponse;
  } catch (error) {
    console.error('Failed to fetch Notion content:', error);
    return NextResponse.json({ error: 'Failed to fetch Notion content' }, { status: 500 });
  }
}