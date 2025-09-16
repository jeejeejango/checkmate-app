
import React, { useState } from 'react';
import { generateTasksFromGoal } from '../services/geminiService';
import { TodoItem } from '../types';
import { X } from 'lucide-react';

interface GeminiSuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTasks: (tasks: Omit<TodoItem, 'id'>[]) => void;
}

const GeminiSuggestModal: React.FC<GeminiSuggestModalProps> = ({ isOpen, onClose, onAddTasks }) => {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const tasks = await generateTasksFromGoal(goal);
      onAddTasks(tasks);
      setGoal('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-secondary p-8 rounded-lg shadow-2xl w-full max-w-lg relative border border-border-color">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-accent">Generate Tasks with AI</h2>
        <p className="text-text-secondary mb-6">Describe your goal, and let AI break it down into actionable tasks for you.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="goal" className="block text-sm font-medium text-text-secondary mb-2">
              Your Goal
            </label>
            <input
              id="goal"
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Plan a trip to Japan"
              className="w-full p-3 bg-primary border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-text-primary transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-accent hover:bg-accent-hover text-white transition-colors flex items-center disabled:opacity-50"
              disabled={isLoading || !goal.trim()}
            >
              {isLoading && (
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
              )}
              {isLoading ? 'Generating...' : 'Generate Tasks'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeminiSuggestModal;
