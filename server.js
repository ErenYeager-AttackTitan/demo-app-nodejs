const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Import uuid for unique ID generation

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Path to the JSON file
const dataFile = path.join(__dirname, 'data.json');

// Ensure the JSON file exists
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]));
}

// POST endpoint to save data
app.post('/save', (req, res) => {
  const { name, link, key } = req.body;

  // Validate request
  if (!name || !link || !key) {
    return res.status(400).json({ error: 'All fields (name, link, key) are required.' });
  }

  if (key !== 'your-secret-key') { // Replace 'your-secret-key' with your desired secret key
    return res.status(403).json({ error: 'Invalid key.' });
  }

  // Generate a unique ID
  const id = uuidv4();

  // Read existing data from the file
  let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  // Add new data
  data.push({ id, name, link });

  // Save updated data to the file
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

  res.json({ message: 'Data saved successfully!', id, name, link });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
