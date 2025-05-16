import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TodoItem } from './TodoItem';
import { AddTodo } from './AddTodo';
import { TodoFilter } from './TodoFilter';
import { addTodo, toggleTodo, deleteTodo } from '@/store/slices/todoSlice';
import type { Todo } from '@/types/todo';
import type { RootState } from '@/store';

// Compound Component Pattern
export const TodoList = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.items);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Memoized handlers using useCallback
  const handleAddTodo = useCallback((text: string) => {
    dispatch(addTodo({ text }));
  }, [dispatch]);

  const handleToggleTodo = useCallback((id: string) => {
    dispatch(toggleTodo(id));
  }, [dispatch]);

  const handleDeleteTodo = useCallback((id: string) => {
    dispatch(deleteTodo(id));
  }, [dispatch]);

  // Filtered todos
  const filteredTodos = todos.filter((todo: Todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      
      {/* Compound Components */}
      <TodoList.AddTodo onAdd={handleAddTodo} />
      <TodoList.Filter value={filter} onChange={setFilter} />
      
      <ul className="mt-4 space-y-2">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
      </ul>
    </div>
  );
};

// Compound Components
TodoList.AddTodo = AddTodo;
TodoList.Filter = TodoFilter; 