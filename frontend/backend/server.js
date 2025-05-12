const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;

const VALID_IDS = {
  p: 'primes',
  f: 'fibo',
  e: 'even',
  r: 'rand',
};

// Your Bearer token
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MDMwODcyLCJpYXQiOjE3NDcwMzA1NzIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImQ1ODVjZTFlLWFmNTMtNDQxMy05YWFkLWY4Y2ZjMDQ2NGRkNSIsInN1YiI6InN1aml0aGcuMjJpdEBrb25ndS5lZHUifSwiZW1haWwiOiJzdWppdGhnLjIyaXRAa29uZ3UuZWR1IiwibmFtZSI6InN1aml0aCBnICIsInJvbGxObyI6IjIyaXRyMTAzIiwiYWNjZXNzQ29kZSI6ImptcFphRiIsImNsaWVudElEIjoiZDU4NWNlMWUtYWY1My00NDEzLTlhYWQtZjhjZmMwNDY0ZGQ1IiwiY2xpZW50U2VjcmV0IjoiTU5yeWN5YWdoRnhIYkhIUyJ9.icI5K_YuulEam56L896hirhcLN8vO2BmoQXEYzv2HjY';

app.use(cors());

let windowNumbers = [];

function calculateAverage(numbers) {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return parseFloat((sum / numbers.length).toFixed(2));
}

app.get('/numbers/:numberid', async (req, res) => {
  const id = req.params.numberid;
  const type = VALID_IDS[id];

  if (!type) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  const apiUrl = `http://20.244.56.144/evaluation-service/${type}`;
  const windowPrevState = [...windowNumbers];
  let numbersFromApi = [];

  const source = axios.CancelToken.source();
  const timeout = setTimeout(() => source.cancel('Timeout after 500ms'), 500);

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`
      },
      cancelToken: source.token,
      timeout: 500
    });

    numbersFromApi = response.data.numbers || [];
  } catch (error) {
    return res.json({
      windowPrevState,
      windowCurrState: [...windowNumbers],
      numbers: [],
      avg: calculateAverage(windowNumbers)
    });
  } finally {
    clearTimeout(timeout);
  }

  for (const num of numbersFromApi) {
    if (!windowNumbers.includes(num)) {
      windowNumbers.push(num);
      if (windowNumbers.length > WINDOW_SIZE) {
        windowNumbers.shift();
      }
    }
  }

  return res.json({
    windowPrevState,
    windowCurrState: [...windowNumbers],
    numbers: numbersFromApi,
    avg: calculateAverage(windowNumbers)
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
