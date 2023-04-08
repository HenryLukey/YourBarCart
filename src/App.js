import './App.css';
import AnimatedRoutes from './components/AnimatedRoutes';
import { AuthContextProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <AuthContextProvider>
        <AnimatedRoutes />
      </AuthContextProvider>
    </div>
  );
}

export default App;
