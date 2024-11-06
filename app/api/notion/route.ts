import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { BlockObjectResponse, PartialBlockObjectResponse, TableBlockObjectResponse, TableRowBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export const revalidate = 60 * 60 * 6; // Revalidate every 6 hours (in seconds)

export interface TaskGroup {
  title: string;
  checkboxes: Task[];
}[];

interface Task {
  text: string;
  checked: boolean;
} 

const NOTION_KEY = process.env.NOTION_API_KEY;
const PAGE_ID = process.env.NOTION_PAGE_ID;
const CACHE_DURATION = 60 * 60; // 1 hour

const notion = new Client({ auth: NOTION_KEY });

// Find the first table recursively
async function findFirstTable(blocks: (BlockObjectResponse | PartialBlockObjectResponse)[]): Promise<TableBlockObjectResponse | null> {
  for (const block of blocks) {
    if ('type' in block && block.type === 'table') {
      return block as TableBlockObjectResponse;
    }
    
    if ('has_children' in block && block.has_children) {
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

// Find the first bulleted list item containing "Weekly Tasks"
async function findFirstTask(blocks: (BlockObjectResponse | PartialBlockObjectResponse)[]): Promise<BlockObjectResponse | null> {
  for (const block of blocks) {
    if ('type' in block && 
        block.type === 'bulleted_list_item' && 
        block.bulleted_list_item.rich_text.some(text => 
          'plain_text' in text && text.plain_text.includes('Weekly Tasks'))) {
      return block;
    }
    
    if ('has_children' in block && block.has_children) {
      const childBlocks = await notion.blocks.children.list({
        block_id: block.id,
        page_size: 100,
      });
      const foundInChildren = await findFirstTask(childBlocks.results);
      if (foundInChildren) return foundInChildren;
    }
  }
  return null;
}


async function getBulletedListContent(block: BlockObjectResponse | null): Promise<TaskGroup[]> {
  if (!block || !('has_children' in block) || !block.has_children) {
    return [];
  }

  const children = await notion.blocks.children.list({
    block_id: block.id,
    page_size: 100,
  });

  const result = [];

  for (const item of children.results) {
    if ('type' in item && item.type === 'bulleted_list_item') {
      const title = item.bulleted_list_item.rich_text
        .map(text => 'plain_text' in text ? text.plain_text : '')
        .join('');

      // Get checkbox items if the bullet point has children
      const checkboxes = [];
      if (item.has_children) {
        const subItems = await notion.blocks.children.list({
          block_id: item.id,
          page_size: 100,
        });

        for (const subItem of subItems.results) {
          if ('type' in subItem && subItem.type === 'to_do') {
            const text = subItem.to_do.rich_text
              .map(text => 'plain_text' in text ? text.plain_text : '')
              .join('');
            checkboxes.push({
              text,
              checked: subItem.to_do.checked,
            });
          }
        }
      }

      result.push({
        title,
        checkboxes
      });
    }
  }

  return result;
}


export async function GET() {
  try {
    const blocks = await notion.blocks.children.list({
      block_id: PAGE_ID as string,
      page_size: 100,
    });

    const taskBlock = await findFirstTask(blocks.results);
    const taskList = await getBulletedListContent(taskBlock);

    const cookingBlock = await findFirstTable(blocks.results);
    const tableData = await getTableData(cookingBlock);

    const cachedResponse = NextResponse.json({taskList, tableData});
    cachedResponse.headers.set('Cache-Control', `s-maxage=${CACHE_DURATION}, stale-while-revalidate`);
    return cachedResponse;
  } catch (error) {
    console.error('Failed to fetch Notion content:', error);
    return NextResponse.json({ error: 'Failed to fetch Notion content' }, { status: 500 });
  }
}

async function getTableData(table: TableBlockObjectResponse | null): Promise<string[][] | null> {
  if (!table) {
    return null;
  }

  const tableRows = await notion.blocks.children.list({
    block_id: table.id,
    page_size: 100,
  });
  
  const tableData = tableRows.results
    .filter((row): row is TableRowBlockObjectResponse => 'type' in row && row.type === 'table_row')
    .map((row) => {
      return row.table_row.cells.map((cell) => 
        cell.map((textObj) => 'plain_text' in textObj ? textObj.plain_text : '').join('')
      );
    });

  return tableData;
}
