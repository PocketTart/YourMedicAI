import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserReportsContent from './UserReports'; 
import UserInfoContent from './UserInfo'; 

const ChatbotContent = ({ user }) => { 
  const name = "Anurag" || 'Guest'; 
  const age = 30;
  const medicalHistory = "Type 2 Diabetes, Skin Allergy, Rashes";

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  const BACKEND_URL = "https://yourmedicai.onrender.com"; // FastAPI backend

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!query.trim()) {
      setError("Please enter a message.");
      return;
    }

    setError(null);
    const userMessage = { sender: 'user', text: query };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/chat/`, {
        name: name,
        age: age,
        medical_history: medicalHistory,
        weight: 70.5,
        medication: "Metformin, Cetirizine",
        bloodgroup: "B+",
        query: query,
      });

      const aiResponse = { sender: 'ai', text: response.data.response };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (err) {
      console.error("Error sending message to backend:", err);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: "Oops! Something went wrong. Please try again." },
      ]);
      setError("Failed to get a response from the AI. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className="p-6 bg-purple-50 rounded-lg shadow-inner border border-purple-100 flex flex-col h-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Start Your AI Conversation</h2>

      <div className="flex-grow bg-white border border-gray-200 rounded-lg p-4 overflow-y-auto flex flex-col min-h-[300px]">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 italic flex-grow flex flex-col justify-center items-center">
            <p>Your AI Health Assistant is ready!</p>
            <p>Type your health-related questions below.</p>
            {user ? (
              <p className="mt-2 text-sm text-gray-500">
                Currently chatting as: {name}, Age: {age}, Medical History: {medicalHistory}
              </p>
            ) : (
              <p className="mt-2 text-sm text-red-500">
                User data is not available. Please ensure you are logged in.
              </p>
            )}
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg max-w-[80%] ${
                msg.sender === 'user'
                  ? 'bg-purple-100 text-right self-end'
                  : 'bg-gray-100 text-left self-start'
              }`}
            >
              <p className="font-semibold text-sm">
                {msg.sender === 'user' ? 'You' : 'AI Assistant'}
              </p>
              <p className="text-gray-800 break-words">{msg.text}</p>
            </div>
          ))
        )}
        {isLoading && (
          <div className="self-center mt-2 p-2 text-gray-500 italic">
            AI is typing...
          </div>
        )}
        {error && (
          <div className="self-center mt-2 p-2 text-red-600 font-medium">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 relative">
        <input
          type="text"
          placeholder="Ask your Medicare AI assistant..."
          className="w-full p-3 pr-12 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          className="absolute rounded-lg cursor-pointer inset-y-0 right-0 flex items-center px-4 bg-purple-800 text-white hover:bg-purple-700 transition duration-300 m-1"
          disabled={isLoading}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const { user, logout, isLoggedIn, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user-info');

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'user-info':
        return <UserInfoContent user={user} onProfileUpdate={updateUser} />;
      case 'user-reports':
        return <UserReportsContent />;
      case 'chatbot':
        return <ChatbotContent user={user} />;
      default:
        return <UserInfoContent user={user} onProfileUpdate={updateUser} />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      {isLoggedIn && user ? (
        <div className="bg-white p-8 h-full rounded-2xl shadow-xl w-full flex flex-col md:flex-row font-inter border border-blue-100">
          <div className="w-1/4 flex flex-col justify-between md:w-1/4 pr-0 md:pr-8 mb-8 md:mb-0 border-b md:border-b-0 md:border-r border-gray-200 pb-8 md:pb-0">
            <div>
              <h1 className="text-5xl text-purple-500 font-extrabold border-b-2 py-2">YourMedicAI</h1>
              <h2 className="text-2xl font-bold text-purple-700 my-6">Dashboard</h2>
              <ul className="space-y-3">
                <li>
                  <button
                    className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-200 text-lg font-medium
                      ${activeTab === 'user-info' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('user-info')}
                  >
                    <i className="fas fa-user mr-3"></i> User Info
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-200 text-lg font-medium
                      ${activeTab === 'user-reports' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('user-reports')}
                  >
                    <i className="fas fa-chart-bar mr-3"></i> User Reports
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-200 text-lg font-medium
                      ${activeTab === 'chatbot' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('chatbot')}
                  >
                    <i className="fas fa-robot mr-3"></i> AI Chatbot
                  </button>
                </li>
              </ul>
            </div>
            <button
              onClick={handleLogout}
              className="mt-8 w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition duration-300 text-lg font-semibold shadow-md flex items-center justify-center"
            >
              <i className="fas fa-sign-out-alt mr-3"></i> Logout
            </button>
          </div>

          <div className="w-full h-full md:w-3/4 md:pl-8">
            <div className="h-full">
              {renderContent()}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-lg shadow-lg text-center border border-purple-100">
          <h1 className="text-4xl font-bold text-purple-700 mb-6">Welcome to Your AI Health Assistant!</h1>
          <p className="text-xl text-gray-600 mb-4">You are not logged in.</p>
          <p className="text-md text-gray-500">Please log in to access the chatbot features.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
