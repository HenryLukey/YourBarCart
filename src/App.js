import './App.css';
import AnimatedRoutes from './components/AnimatedRoutes';
import { AuthContextProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <div className="App">
      <HelmetProvider>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <AuthContextProvider>
        <AnimatedRoutes />
      </AuthContextProvider>
      </HelmetProvider>
    </div>
  );
}

export default App;
