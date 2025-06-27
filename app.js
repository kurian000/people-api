const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());

let people = [];

app.get('/people', (req, res) => {
  res.json(people);
});

app.post('/people', (req, res) => {
  const { name, age } = req.body;
  if (!name || !age || isNaN(age)) {
    return res.status(400).json({ error: 'Name and age are required, and age must be a number' });
  }
  people.push({ name, age });
  res.status(201).json({ message: 'Person added', person: { name, age } });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});