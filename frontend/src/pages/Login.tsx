import { useState } from "react";
import './Login.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const SubmitLogin = (email: string, password: string) => {
    fetch(import.meta.env.VITE_API_URL + '/login?email=' + email + '&password=' + password, {
      method: 'POST',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setToken(data.access_token); // Note: backend returns 'access_token', not 'token'
    })
    .catch(error => {
      console.error('Login error:', error);
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
      {
        token && <div>
          <h2>Token: {token}</h2>
        </div>
      }
    </div>
  );
}

export default Login;