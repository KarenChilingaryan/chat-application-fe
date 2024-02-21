import React from 'react';
import './App.css';
import ChatRoom from './components/ChatRoom';

const rooms = [
  {
    name: 'valod',
    id: 1,
    messages: []
  },
  {
    name: 'valod1',
    id: 2,
    messages: []
  },
  {
    name: 'valod2',
    id: 3,
    messages: []
  },
  {
    name: 'valod3',
    id: 4,
    messages: []
  }
]

function App() {
  return (
    <div className="App">
      <ChatRoom chatRooms={rooms} />
    </div>
  );
}

export default App;
