'use client';

import React from 'react';
import useMenuHighlight from './hooks/useMenuHighlight';
import { NotionTable as NotionTableType } from './lib/api';

interface NotionTableProps {
  notionTable: NotionTableType;
}

const NotionTable: React.FC<NotionTableProps> = ({ notionTable }) => {
  const highlightText = useMenuHighlight();

  const highlightRow = (row: string[], index: number) => {
    if (index === 0) return false; // Don't highlight header
    return row[0].toLowerCase().includes(highlightText);
  };

  if (notionTable.length === 0) {
    return <p>No Notion content available</p>;
  }

  return (
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
          <tr key={rowIndex} style={highlightRow(row, rowIndex + 1) ? { backgroundColor: '#fffacd' } : {}}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default NotionTable;