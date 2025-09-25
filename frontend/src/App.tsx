import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Protected from './pages/Protected';
import ProtectedRoute from './components/ProtectedRoute';
import Cookies from 'js-cookie';

const backend_url = import.meta.env.VITE_API_URL || 'error: VITE_API_URL not set';

function Home() {
  const isLoggedIn = !!Cookies.get('access_token');

  return (
    <>
      <h1>Mini LIMS</h1>
      <p>
        The backend url is {backend_url}
      </p>
      {!isLoggedIn && (
        <p>
          <Link to="/login">Please log in</Link> to access protected features.
        </p>
      )}
      {isLoggedIn && (
        <p>
          Welcome back! <Link to="/protected">Go to Protected Area</Link>
        </p>
      )}
    </>
  );
}

function App() {
  const isLoggedIn = !!Cookies.get('access_token');
  
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | 
        {!isLoggedIn && <Link to="/login"> Login</Link>}
        {isLoggedIn && <Link to="/protected"> Protected</Link>}
      </nav>
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
