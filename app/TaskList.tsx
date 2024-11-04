interface CheckboxItem {
  text: string;
  checked: boolean;
}

interface TaskGroup {
  title: string;
  checkboxes: CheckboxItem[];
}

interface TaskListProps {
  tasks: TaskGroup[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  return (
    <div className="mt-4">
      {tasks.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-6">
          <h3 className="text-lg font-medium mb-2">{group.title}</h3>
          <ul className="space-y-1">
            {group.checkboxes.map((item, itemIndex) => (
              <li 
                key={itemIndex} 
                className={`flex items-center gap-2 ${
                  item.checked ? 'text-gray-500' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  readOnly
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={item.checked ? 'line-through' : ''}>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TaskList; 