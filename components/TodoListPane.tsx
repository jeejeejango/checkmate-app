import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { TodoItem as TodoItemType } from '../types';
import TodoItem from './TodoItem';
import GeminiSuggestModal from './GeminiSuggestModal';
import { parseTasksFromVoice } from '../services/geminiService';
import { Sparkles, Plus, Mic } from 'lucide-react';

interface TodoListPaneProps {
  selectedListId: string | null;
}

const TodoListPane: React.FC<TodoListPaneProps> = ({ selectedListId }) => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!user || !selectedListId) {
      setTodos([]);
      return;
    }
    setLoading(true);
    const q = query(
      collection(db, 'users', user.uid, 'lists', selectedListId, 'items'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TodoItemType));
      setTodos(todosData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user, selectedListId]);
  
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim() === '' || !user || !selectedListId) return;

    await addDoc(collection(db, 'users', user.uid, 'lists', selectedListId, 'items'), {
      text: newTodoText,
      completed: false,
      createdAt: serverTimestamp(),
    });
    setNewTodoText('');
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    if (!user || !selectedListId) return;
    const todoRef = doc(db, 'users', user.uid, 'lists', selectedListId, 'items', id);
    await updateDoc(todoRef, { completed: !completed });
  };

  const handleDeleteTodo = async (id: string) => {
    if (!user || !selectedListId) return;
    await deleteDoc(doc(db, 'users', user.uid, 'lists', selectedListId, 'items', id));
  };
  
  const handleAddSuggestedTasks = async (tasks: Omit<TodoItemType, 'id'>[]) => {
     if (!user || !selectedListId || tasks.length === 0) return;
     
     const batch = writeBatch(db);
     const itemsCollectionRef = collection(db, 'users', user.uid, 'lists', selectedListId, 'items');
     
     tasks.forEach(task => {
        const docRef = doc(itemsCollectionRef);
        batch.set(docRef, task);
     });
     
     await batch.commit();
  }
  
  const handleToggleVoiceInput = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Sorry, your browser doesn't support voice recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setVoiceError(null);
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        setVoiceError("I didn't hear that. Please try again.");
      } else if (event.error === 'not-allowed') {
        setVoiceError("Microphone access was denied. Please enable it in your browser settings.");
      } else {
        setVoiceError(`An error occurred: ${event.error}`);
      }
      setIsRecording(false);
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsParsing(true);
      setVoiceError(null);
      try {
        const tasks = await parseTasksFromVoice(transcript);
        if (tasks.length > 0) {
          await handleAddSuggestedTasks(tasks);
        } else {
          setVoiceError("Couldn't identify any tasks from your speech.");
        }
      } catch (error: any) {
        setVoiceError(error.message || "Failed to parse tasks from speech.");
      } finally {
        setIsParsing(false);
      }
    };
    
    recognition.start();
  };


  if (!selectedListId) {
    return <div className="flex items-center justify-center h-full text-text-secondary text-lg">Select or create a list to get started.</div>;
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-3xl font-bold mb-6 text-text-primary">Tasks</h2>
      <div className="flex mb-4 space-x-2">
        <form onSubmit={handleAddTodo} className="flex-1 flex">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-3 bg-secondary border border-border-color rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button type="submit" className="p-3 bg-accent text-white rounded-r-md hover:bg-accent-hover">
            <Plus size={24} />
          </button>
        </form>
        <button
          onClick={handleToggleVoiceInput}
          disabled={isParsing}
          className={`flex items-center justify-center w-14 p-3 rounded-md transition-colors ${
            isRecording 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isParsing ? (
            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <Mic size={24} />
          )}
        </button>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center p-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <Sparkles size={24} className="mr-2"/> Suggest
        </button>
      </div>
      
      {voiceError && <p className="text-red-500 text-sm mb-4 text-center">{voiceError}</p>}

      <div className="flex-1 overflow-y-auto">
        {loading ? <p className="text-text-secondary">Loading tasks...</p> : (
            todos.map(todo => (
              <TodoItem key={todo.id} todo={todo} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
            ))
        )}
      </div>
      
      <GeminiSuggestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAddTasks={handleAddSuggestedTasks}
       />
    </div>
  );
};

export default TodoListPane;