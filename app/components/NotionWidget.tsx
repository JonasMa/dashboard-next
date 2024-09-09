import { getFirstNotionTable } from '../lib/api';

const NotionWidget = async () => {
  const notionTable = await getFirstNotionTable();

  return (
    <div className="widget notion-widget">
      <h2>Notion Content</h2>
      {notionTable.length > 0 ? (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {notionTable[0].map((header, index) => (
                <th key={index} style={{ borderBottom: '2px solid #ddd', padding: '8px', textAlign: 'left' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {notionTable.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Notion content available</p>
      )}
    </div>
  );
};

export default NotionWidget;