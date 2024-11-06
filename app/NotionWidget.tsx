import { getFirstNotionTable } from './lib/api';
import NotionTable from './NotionTable';
import TaskList from './TaskList';

// Currently not used
// @deprecated
export default async function NotionWidget() {
  const { tableData, taskList } = await getFirstNotionTable();

  return (
    <div className="widget notion-widget">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="mb-4">Wer kocht?</h2>
          <NotionTable notionTable={tableData} />
        </div>
        <div>
          <h2 className="mb-4">Wochenaufgaben</h2>
          <TaskList tasks={taskList} />
        </div>
      </div>
    </div>
  );
};
