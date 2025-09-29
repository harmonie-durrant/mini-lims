import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Cookies from 'js-cookie';

import Login from './pages/Login';
import Protected from './pages/Protected';

const backend_url = import.meta.env.VITE_API_URL || 'error: VITE_API_URL not set';

function Home() {
  const isLoggedIn = !!Cookies.get('access_token');

  return (
    <div className='flex flex-col text-center items-center justify-center flex-1 bg-gray-100'>
      <h1 className="text-3xl font-bold underline">
        Mini LIMS
      </h1>
      <p className="mb-4 text-lg">
        The backend url is {backend_url}
      </p>
      {!isLoggedIn && (
        <p className="mb-4 text-lg">
          <Link to="/login">Please log in</Link> to access protected features.
        </p>
      )}
      {isLoggedIn && (
        <p className="mb-4 text-lg">
          Welcome back! <Link to="/protected">Go to Protected Area</Link>
        </p>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/protected" 
          element={
            <ProtectedRoute>
              <Protected />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
