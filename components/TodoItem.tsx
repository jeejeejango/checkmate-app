
import React from 'react';
import { TodoItem as TodoItemType } from '../types';
import { Trash2 } from 'lucide-react';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="flex items-center p-3 bg-secondary rounded-lg mb-2 border border-border-color transition-all hover:border-accent">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, todo.completed)}
        className="w-6 h-6 mr-4 rounded bg-primary border-border-color text-accent focus:ring-accent"
      />
      <span className={`flex-1 ${todo.completed ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)} className="p-2 text-text-secondary hover:text-red-500 rounded-full">
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default TodoItem;
