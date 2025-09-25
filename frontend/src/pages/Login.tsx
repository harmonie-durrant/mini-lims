import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Login.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      navigate('/protected');
    }
  }, [navigate]);

  const SubmitLogin = (email: string, password: string) => {
    setError('');

    fetch(import.meta.env.VITE_API_URL + '/login?email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password), {
      method: 'POST',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      return response.json();
    })
    .then(data => {
      Cookies.set('access_token', data.access_token, { expires: 7 });
      navigate('/protected');
    })
    .catch(error => {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials.');
    });
  }

  return (
    <div>
      <h1>Login Page</h1>
      <form className="login-form" onSubmit={(e) => { e.preventDefault(); SubmitLogin(email, password) }}>
        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

export default Login;