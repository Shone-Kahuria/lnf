const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all items
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM items ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get item by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM items WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new item
router.post('/', async (req, res) => {
  const { title, description, category, location, status, date_found_lost, contact_info } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO items (title, description, category, location, status, date_found_lost, contact_info) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, category, location, status, date_found_lost, contact_info]
    );
    res.status(201).json({ id: result.insertId, message: 'Item added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  const { title, description, category, location, status, date_found_lost, contact_info } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE items SET title = ?, description = ?, category = ?, location = ?, status = ?, date_found_lost = ?, contact_info = ? WHERE id = ?',
      [title, description, category, location, status, date_found_lost, contact_info, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM items WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
