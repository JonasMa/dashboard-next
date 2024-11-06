import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { checked, checkboxPropertyName } = await request.json();

    await notion.pages.update({
      page_id: process.env.NOTION_PAGE_ID!,
      properties: {
        [checkboxPropertyName]: {
          checkbox: checked
        }
      },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to update Notion:', error);
    return new Response(JSON.stringify({ error: 'Failed to update task' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 