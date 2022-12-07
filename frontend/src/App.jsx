import { BrowserRouter } from 'react-router-dom';
import ParticlesComponent from './components/particales';
import AuthProvider from './context/AuthContext';
import IRoutes from './routes';
import './styles/index.scss';
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ParticlesComponent className="particles" />
        <IRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
