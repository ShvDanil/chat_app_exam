import React, { useState, useEffect } from 'react';
import './Chat.css';
import io from 'socket.io-client';
import '@fortawesome/fontawesome-free/css/all.css';

let globalSocket;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!globalSocket) {
      globalSocket = io('http://localhost:4000');
    }

    globalSocket.emit('username', username);

    globalSocket.on('message', (data) => {
      setMessages([...messages, data]);
    });

    return () => {
      globalSocket.off('message');
    };
  }, [username, messages]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '' && globalSocket) {
      globalSocket.emit('message', { sender: username, text: inputValue });
      setInputValue('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat</h1>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={message.sender === username ? 'message user-message' : 'message'}>
            <span className="message-sender">{message.sender}:</span> {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleMessageSubmit} className="chat-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="input-message"
        />
        <button type="submit" className="send-button">
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        className="input-username"
      />
    </div>
  );
};

export default Chat;
