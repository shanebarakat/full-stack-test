import { useState } from 'react';
import type { CreateTaskRequest } from '../types';

interface TaskFormProps {
  onSubmit: (task: CreateTaskRequest) => void;
}

/**
 * A React component for rendering a task creation form.
 * Handles user input for task details and submits the data via the onSubmit prop.
 *
 * @param {TaskFormProps} props - The properties for the component.
 */
export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('');

  /**
   * Validates the title to ensure it's not empty after trimming.
   * This check prevents submission of incomplete forms.
   *
   * @returns {boolean} True if the title is valid, false otherwise.
   */
  const validateTitle = () => {
    return title.trim() !== '';
  };

  /**
   * Prepares the task data object based on current state values.
   * Ensures data is trimmed and provides defaults where appropriate.
   *
   * @returns {CreateTaskRequest} The formatted task data ready for submission.
   */
  const prepareTaskData = (): CreateTaskRequest => {
    return {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category: category.trim() || 'general',
    };
  };

  /**
   * Resets the form state to initial values after successful submission.
   * This clears the form for the next use.
   */
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('');
  };

  /**
   * Handles the form submission event.
   * Prevents default form behavior, validates input, submits data if valid, and resets the form.
   * This function orchestrates the submission process while delegating specific tasks to other functions.
   *
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();  // Prevent the default page reload on form submit
    
    // Check if the title is valid before proceeding
    if (!validateTitle()) {
      // Early return to handle invalid input without further processing
      return;
    }
    
    // Prepare and submit the task data
    onSubmit(prepareTaskData());
    
    // Reset the form after successful submission
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter task title..."
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter task description..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Work, Personal..."
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
      >
        Add Task
      </button>
    </form>
  );
}