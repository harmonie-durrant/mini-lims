import { useState } from "react";

function Login() {

  const SubmitLogin = (email: string, password: string) => {
    console.log("Email:", email);
    console.log("Password:", password);
  }

  // Use react to handle the state of the email and password inputs

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={(e) => { e.preventDefault(); SubmitLogin(email, password) }}>
        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;