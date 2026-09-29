import { useCallback, useState, useReducer } from "react";
import "./App.css";
import { ChatWindow } from "./components/ChatWindow/ChatWindow";
import { CreateChatModal } from "./components/CreateChatModal/CreateChatModal";
import { LoginForm } from "./components/LoginForm/LoginForm";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { useAuth } from "./hooks/useAuth";
import { usePolling } from "./hooks/usePolling";
import { chatReducer, initialState } from "./store/chatReducer";

function App() {
  const { credentials, isLoading, error, login, logout } = useAuth();
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    dispatch({ type: "reset" });
  }, [logout, dispatch]);

  usePolling(credentials, dispatch, handleLogout);

  if (!credentials) {
    return <LoginForm onLogin={login} isLoading={isLoading} error={error} />;
  }

  const activeChat = state.chats.find((chat) => chat.chatId === state.activeChatId);

  return (
    <div className="layout">
      <nav className="nav">
        <button type="button" className="logout" onClick={handleLogout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </nav>
      <Sidebar
        chats={state.chats}
        activeChatId={state.activeChatId}
        messagesByChat={state.messagesByChat}
        onSelectChat={(chatId) => dispatch({ type: "selectChat", chatId })}
        onCreateChat={() => setIsCreateChatOpen(true)}
      />
      <main className="main">
        {activeChat && (
          <ChatWindow
            chat={activeChat}
            credentials={credentials}
            messages={state.messagesByChat[activeChat.chatId] ?? []}
            onMessageSent={(message) => dispatch({ type: "messageAdded", message })}
          />
        )}
      </main>
      <CreateChatModal
        isOpen={isCreateChatOpen}
        credentials={credentials}
        onClose={() => setIsCreateChatOpen(false)}
        onCreated={(chat) => dispatch({ type: "addChat", chat })}
      />
    </div>
  );
}

export default App;
