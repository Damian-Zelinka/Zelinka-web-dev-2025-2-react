import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext.jsx';  
import './css/index.css'


import App from './pages/App.jsx'


const Root = () => {
  const { loading } = useAuth();

  if (loading) return null;

  return <App />;
};


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
