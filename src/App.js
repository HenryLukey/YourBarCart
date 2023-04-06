import './App.css';
import AnimatedRoutes from './components/AnimatedRoutes';
import { AuthContextProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <AnimatedRoutes />
      </AuthContextProvider>
    </div>
  );
}

export default App;
