import { getFirstNotionTable } from '../lib/api';
import NotionTable from './NotionTable';

const NotionWidget = async () => {
  const notionTable = await getFirstNotionTable();

  return (
    <div className="widget notion-widget">
      <h2>Wer kocht?</h2>
      <NotionTable notionTable={notionTable} />
    </div>
  );
};

export default NotionWidget;