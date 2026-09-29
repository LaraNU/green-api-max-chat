import "./App.css";
import { LoginForm } from "./components/LoginForm/LoginForm";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { credentials, isLoading, error, login, logout } = useAuth();

  if (credentials) {
    return (
      <div>
        <button type="button" onClick={logout} className="logoutBtn">
          Выйти
        </button>
      </div>
    );
  }

  return <LoginForm onLogin={login} isLoading={isLoading} error={error} />;
}

export default App;
