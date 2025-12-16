require('dotenv').config();       // load .env

const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // our DB connection

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Smart Asset Management Backend is running');
});

///////////////////////
// ASSETS ENDPOINTS  //
///////////////////////

// GET all assets
app.get('/assets', (req, res) => {
  const sql = 'SELECT * FROM assets';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching assets:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
});

// GET single asset by id
app.get('/assets/:id', (req, res) => {
  const sql = 'SELECT * FROM assets WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching asset:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.json(results[0]);
  });
});

// CREATE new asset
app.post('/assets', (req, res) => {
  const { asset_tag, name, type, location, status, condition } = req.body;

  const sql = `
    INSERT INTO assets (asset_tag, name, type, location, status, condition)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [asset_tag, name, type, location, status, condition], (err, result) => {
    if (err) {
      console.error('Error creating asset:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(201).json({ id: result.insertId, message: 'Asset created' });
  });
});

// UPDATE asset
app.put('/assets/:id', (req, res) => {
  const { asset_tag, name, type, location, status, condition } = req.body;

  const sql = `
    UPDATE assets
    SET asset_tag = ?, name = ?, type = ?, location = ?, status = ?, condition = ?
    WHERE id = ?
  `;
  db.query(
    sql,
    [asset_tag, name, type, location, status, condition, req.params.id],
    (err, result) => {
      if (err) {
        console.error('Error updating asset:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.json({ message: 'Asset updated' });
    }
  );
});

// DELETE asset (optional)
app.delete('/assets/:id', (req, res) => {
  const sql = 'DELETE FROM assets WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting asset:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json({ message: 'Asset deleted' });
  });
});

///////////////////////
// SERVER START      //
///////////////////////

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
