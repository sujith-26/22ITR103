import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [numberType, setNumberType] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    if (!numberType) {
      setError('Please select a valid number type.');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:9876/numbers/${numberType}`);
      setResult(res.data);
      setError('');
    } catch (err) {
      setError('Error fetching data. Please ensure the backend is running.');
      setResult(null);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Average Calculator Microservice</h2>

      <label htmlFor="numberType">Choose type: </label>
      <select
        id="numberType"
        value={numberType}
        onChange={(e) => setNumberType(e.target.value)}
      >
        <option value="">--Select--</option>
        <option value="p">Prime</option>
        <option value="f">Fibonacci</option>
        <option value="e">Even</option>
        <option value="r">Random</option>
      </select>

      <button onClick={handleFetch} style={{ marginLeft: '1rem' }}>
        Fetch Numbers
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h4>Response:</h4>
          <pre style={{ backgroundColor: '#f4f4f4', padding: '1rem' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default App;
