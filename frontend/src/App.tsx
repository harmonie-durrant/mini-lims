import './App.css'
const backend_url = import.meta.env.VITE_API_URL || 'error: VITE_API_URL not set';


function App() {
  return (
    <>
      <h1>Mini LIMS</h1>
      <p>
        The backend url is {backend_url}
      </p>
    </>
  )
}

export default App
