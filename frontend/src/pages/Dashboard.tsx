import Cookies from 'js-cookie';

function Dashboard() {
  const token = Cookies.get('access_token');

  const handleLogout = () => {
    Cookies.remove('access_token');
    window.location.href = '/login';
  };

  return (
    <div>
      <h1>Dashboard Page</h1>
      <p>Your access token: <code>{token}</code></p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;