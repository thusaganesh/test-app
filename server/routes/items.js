const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET /api/items - list items (most recent first)
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/items - create new item
router.post('/', async (req, res) => {
  try {
    const { Item_no,title, description, price, category,quantity, imageUrl } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const newItem = new Item({Item_no, title, description, price, category,quantity, imageUrl });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/items/:id
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Item.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', id: removed._id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/items/:id - update
router.put('/:id', async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
