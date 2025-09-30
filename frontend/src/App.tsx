import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Cookies from 'js-cookie';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';

const backend_url = import.meta.env.VITE_API_URL || 'error: VITE_API_URL not set';

async function ping_backend(url: string): Promise<boolean> {
  try {
    const response = await fetch(url + '/', { method: 'GET' });
    return response.ok;
  } catch (error) {
    console.error('Error pinging backend:', error);
    return false;
  }
}

function Home({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className='flex flex-col text-center items-center justify-center flex-1'>
      <h1 className="text-3xl font-bold underline">
        Mini LIMS
      </h1>
      <p className="mb-4 text-lg">
        The backend url is {backend_url}
      </p>
      {!isLoggedIn && (
        <p className="mb-4 text-lg">
          <Link to="/login">Please log in</Link> to access the system.
        </p>
      )}
      {isLoggedIn && (
        <p className="mb-4 text-lg">
          Welcome back! <Link to="/dashboard">Go to Dashboard</Link>
        </p>
      )}
    </div>
  );
}

function App() {
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkBackend() {
      if (!backend_url || backend_url === 'error: VITE_API_URL not set') {
        setBackendAvailable(false);
        setIsLoading(false);
        return;
      }
      
      const available = await ping_backend(backend_url);
      setBackendAvailable(available);
      setIsLoading(false);
    }

    checkBackend();
  }, []);

  if (isLoading) {
    return (
      <div className='flex flex-col text-center items-center justify-center flex-1'>
        <p className="mb-4 text-lg">Checking backend connection...</p>
      </div>
    );
  }

  if (!backend_url || backend_url === 'error: VITE_API_URL not set' || !backendAvailable) {
    console.error('Backend URL is not configured correctly or is unreachable.');
    return (
      <div className='flex flex-col text-center items-center justify-center flex-1'>
        <p className="mb-4 text-2xl p-4 rounded-xl bg-red-200 text-red-800 font-bold">
          Error: Backend URL is not configured correctly or is unreachable.
        </p>
        <p className="mb-4 text-xl text-gray-500 font-bold">
          Error code: {!backend_url || backend_url === 'error: VITE_API_URL not set' ? 'VITE_API_URL_NOT_SET' : 'BACKEND_UNREACHABLE'}
        </p>
      </div>
    );
  }

  return (
    <Router>
      <AppContent 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
      />
    </Router>
  )
}

function AppContent({ isLoggedIn, setIsLoggedIn }: { 
  isLoggedIn: boolean, 
  setIsLoggedIn: (value: boolean) => void 
}) {
  const location = useLocation();

  useEffect(() => {
    const loggedIn = !!Cookies.get('access_token');
    setIsLoggedIn(loggedIn);
  }, [location.pathname, setIsLoggedIn]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const loggedIn = !!Cookies.get('access_token');
      if (loggedIn !== isLoggedIn) {
        setIsLoggedIn(loggedIn);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, isLoggedIn, setIsLoggedIn]);

  return (
    <>
      {isLoggedIn ? <Navigation /> : <></>}
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App
