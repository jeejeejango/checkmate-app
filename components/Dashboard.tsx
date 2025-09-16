
import React, { useState } from 'react';
import Header from './Header';
import ListSidebar from './ListSidebar';
import TodoListPane from './TodoListPane';

const Dashboard: React.FC = () => {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <ListSidebar selectedListId={selectedListId} setSelectedListId={setSelectedListId} />
        <main className="flex-1 bg-primary overflow-y-auto">
          <TodoListPane selectedListId={selectedListId} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
