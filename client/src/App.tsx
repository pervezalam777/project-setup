import { useState, useEffect  } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [backendMessage, setBackendMessage] = useState('');
  const [echoResponse, setEchoResponse] = useState('');
  const [echoInput, setEchoInput] = useState('');

  useEffect(() => {
    // Fetch from backend API
    fetch('http://localhost:3000/api/hello')
      .then((res) => res.json())
      .then((data) => setBackendMessage(data.message))
      .catch((error) => console.error('Error fetching backend message:', error));
  }, []);

 const sendEcho = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/echo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: echoInput }),
      });
      const data = await res.json();
      setEchoResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error sending echo:', error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <h2>Backend Status</h2>
      <p>Backend message: {backendMessage}</p>

      <h3>Echo API Test</h3>
      <input
        type="text"
        value={echoInput}
        onChange={(e) => setEchoInput(e.target.value)}
        placeholder="Enter message to echo"
      />
      <button onClick={sendEcho}>Send Echo</button>
      {echoResponse && (
        <pre style={{ backgroundColor: '#eee', padding: '10px', borderRadius: '5px' }}>
          {echoResponse}
        </pre>
      )}
    </>
  );
}

export default App
