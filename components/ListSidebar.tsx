
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { TodoList } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface ListSidebarProps {
  selectedListId: string | null;
  setSelectedListId: (id: string | null) => void;
}

const ListSidebar: React.FC<ListSidebarProps> = ({ selectedListId, setSelectedListId }) => {
  const { user } = useAuth();
  const [lists, setLists] = useState<TodoList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const q = query(collection(db, 'users', user.uid, 'lists'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const listsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TodoList));
      setLists(listsData);
      if (!selectedListId && listsData.length > 0) {
        setSelectedListId(listsData[0].id);
      } else if (listsData.length === 0) {
        setSelectedListId(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAddList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim() === '' || !user) return;
    await addDoc(collection(db, 'users', user.uid, 'lists'), {
      name: newListName,
      createdAt: serverTimestamp(),
      owner: user.uid,
    });
    setNewListName('');
  };
  
  const handleDeleteList = async (listId: string) => {
    if(!user) return;
    // Note: This does not delete subcollections (items). For a production app, use a Cloud Function.
    await deleteDoc(doc(db, 'users', user.uid, 'lists', listId));
    if (selectedListId === listId) {
        setSelectedListId(lists.length > 1 ? lists[0].id : null);
    }
  }

  return (
    <aside className="w-64 bg-secondary p-4 border-r border-border-color flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">My Lists</h2>
      <form onSubmit={handleAddList} className="flex mb-4">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name..."
          className="flex-1 p-2 bg-primary border border-border-color rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button type="submit" className="p-2 bg-accent text-white rounded-r-md hover:bg-accent-hover">
          <Plus size={20} />
        </button>
      </form>
      <nav className="flex-1 overflow-y-auto">
        {loading ? <p className="text-text-secondary">Loading lists...</p> : (
            <ul>
            {lists.map(list => (
              <li
                key={list.id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer mb-1 transition-colors ${
                  selectedListId === list.id ? 'bg-accent text-white' : 'hover:bg-gray-700'
                }`}
                onClick={() => setSelectedListId(list.id)}
              >
                <span className="truncate">{list.name}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteList(list.id); }} className="ml-2 p-1 rounded hover:bg-red-500/50">
                    <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
};

export default ListSidebar;
