import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { BlockObjectResponse, PartialBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const NOTION_KEY = process.env.NOTION_API_KEY;
const PAGE_ID = process.env.NOTION_PAGE_ID;
const CACHE_DURATION = 60 * 60; // 1 hour

const notion = new Client({ auth: NOTION_KEY });

// Find the first table recursively
async function findFirstTable(blocks: any[]): Promise<BlockObjectResponse | null> {
  for (const block of blocks) {
    if (block.type === 'table') {
        return block;
    }
    
    if (block.has_children) {
      const childBlocks = await notion.blocks.children.list({
        block_id: block.id,
        page_size: 100,
      });
      const foundInChildren = await findFirstTable(childBlocks.results);
      if (foundInChildren) return foundInChildren;
    }
  }
  return null;
}

export async function GET() {
  try {
    const blocks = await notion.blocks.children.list({
      block_id: PAGE_ID as string,
      page_size: 100,
    });

    const taskBlock = await findFirstTable(blocks.results);
    const tableData = await getTableData(taskBlock);

    const cachedResponse = NextResponse.json(tableData);
    cachedResponse.headers.set('Cache-Control', `s-maxage=${CACHE_DURATION}, stale-while-revalidate`);
    return cachedResponse;
  } catch (error) {
    console.error('Failed to fetch Notion content:', error);
    return NextResponse.json({ error: 'Failed to fetch Notion content' }, { status: 500 });
  }
}

async function getTableData(table: PartialBlockObjectResponse | BlockObjectResponse | null) {
  if (!table) {
    return null;
  }

  const tableRows = await notion.blocks.children.list({
    block_id: table.id,
    page_size: 100,
  });
  const tableData = tableRows.results.map((row: any) => {
    if (row.type === 'table_row') {
      return row.table_row.cells.map((cell: any) => cell.map((textObj: any) => textObj.plain_text).join('')
      );
    }
    return null;
  }).filter(Boolean);

  return tableData;
}
