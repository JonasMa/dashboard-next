import { getNotionContent } from '../lib/api';

const NotionWidget = async () => {
  const notionContent = await getNotionContent();

  return (
    <div className="widget notion-widget">
      <h2>Notion Content</h2>
      {notionContent.length > 0 ? (
        <div>
          {notionContent.map((block: any) => {
            switch (block.type) {
              case 'paragraph':
                return <p key={block.id}>{block.content}</p>;
              case 'heading_1':
                return <h1 key={block.id}>{block.content}</h1>;
              case 'heading_2':
                return <h2 key={block.id}>{block.content}</h2>;
              case 'heading_3':
                return <h3 key={block.id}>{block.content}</h3>;
              default:
                return null;
            }
          })}
        </div>
      ) : (
        <p>No Notion content available</p>
      )}
    </div>
  );
};

export default NotionWidget;