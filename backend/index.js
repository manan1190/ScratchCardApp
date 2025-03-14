const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const app = express();
const port = 5000;

const frontendUrl = process.env.REACT_APP_FRONTEND_URL;

app.use(cors({
  origin: frontendUrl,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

const dataFilePath = './data.json';

// Read all cards
app.get('/api/cards', async (req, res) => {
  try {
    console.log("Inside Cards")
    const data = await fs.readFile(dataFilePath, 'utf8');
    const cards = JSON.parse(data);
    res.json(cards);
  } catch (error) {
    console.error('Error reading cards:', error);
    res.status(500).json({ error: 'Failed to read cards' });
  }
});

// Read a specific card by ID
app.get('/api/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(dataFilePath, 'utf8');
    const cards = JSON.parse(data);
    const card = cards.find((c) => c.id === id);
    if (card) {
      res.json(card);
    } else {
      res.status(404).json({ error: 'Card not found' });
    }
  } catch (error) {
    console.error('Error reading card:', error);
    res.status(500).json({ error: 'Failed to read card' });
  }
});

// Create a new card
app.post('/api/cards', async (req, res) => {
  try {
    const { amount } = req.body;
    const id = uuidv4();
    const createdAt = new Date();
    const newCard = { id, amount, createdAt, scratched: false };

    const data = await fs.readFile(dataFilePath, 'utf8');
    let cards = JSON.parse(data);
    cards.push(newCard);
    await fs.writeFile(dataFilePath, JSON.stringify(cards, null, 2), 'utf8');

    res.status(201).json(newCard);
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ error: 'Failed to create card' });
  }
});

// Update scratched status
app.patch('/api/cards/:id/scratch', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(dataFilePath, 'utf8');
    let cards = JSON.parse(data);
    const cardIndex = cards.findIndex((c) => c.id === id);

    if (cardIndex === -1) {
      return res.status(404).json({ error: 'Card not found' });
    }

    cards[cardIndex].scratched = true;
    await fs.writeFile(dataFilePath, JSON.stringify(cards, null, 2), 'utf8');

    res.json(cards[cardIndex]);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: 'Failed to update card', details: error.message, stack: error.stack });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log("Frontend URL:", frontendUrl);
});