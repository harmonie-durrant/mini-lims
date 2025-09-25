import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';

const backend_url = import.meta.env.VITE_API_URL || 'error: VITE_API_URL not set';

function Home() {
  return (
    <>
      <h1>Mini LIMS</h1>
      <p>
        The backend url is {backend_url}
      </p>
    </>
  );
}

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
