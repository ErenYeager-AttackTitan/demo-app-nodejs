const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const dataFile = path.join(__dirname, 'data.json');

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]));
}

// POST endpoint to save data
app.post('/save', (req, res) => {
  const { name, link, key } = req.body;

  if (!name || !link || !key) {
    return res.status(400).json({ error: 'All fields (name, link, key) are required.' });
  }

  if (key !== 'your-secret-key') {
    return res.status(403).json({ error: 'Invalid key.' });
  }

  const id = uuidv4();

  let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  data.push({ id, name, link });

  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

  res.json({ message: 'Data saved successfully!', id, name, link });
});

// GET endpoint to fetch all data
app.get('/data', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
