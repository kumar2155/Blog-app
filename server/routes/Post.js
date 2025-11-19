const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Post = require('../models/Post');

// CREATE POST
router.post('/', auth, [
  body('title').isLength({min:5, max:120}).withMessage('Title must be between 5 and 120 characters'),
  body('content').isLength({min:50}).withMessage('Content must be at least 50 characters'),
  body('imageURL').optional({ checkFalsy: true }).isURL().withMessage('Image URL must be a valid URL')
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, imageURL, content } = req.body;
    const p = await Post.create({
      title,
      imageURL,
      content,
      username: req.user.username,
      userId: req.user.id
    });
    res.status(201).json(p);
  } catch (e) {
    res.status(500).json({ message: "server error" });
  }
});

// LIST POSTS
router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10);
  const search = req.query.search?.trim() || "";

  const filter = search ? {
    $or: [
      { title: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } }
    ]
  } : {};

  try {
    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ data: posts, meta: { page, limit, total } });
  } catch (e) {
    res.status(500).json({ message: "server error" });
  }
});

// GET SINGLE
router.get('/:id', async (req, res) => {
  try {
    const p = await Post.findById(req.params.id);
    if(!p) return res.status(404).json({ message: "not found" });
    res.json(p);
  } catch (e) {
    res.status(500).json({ message: "server error" });
  }
});

// UPDATE
router.put('/:id', auth, [
  body('title').optional().isLength({min:5,max:120}).withMessage('Title must be between 5 and 120 characters'),
  body('content').optional().isLength({min:50}).withMessage('Content must be at least 50 characters'),
  body('imageURL').optional({ checkFalsy: true }).isURL().withMessage('Image URL must be a valid URL')
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const p = await Post.findById(req.params.id);
    if(!p) return res.status(404).json({ message: "not found" });
    if(p.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "not owner" });

    p.title = req.body.title ?? p.title;
    p.content = req.body.content ?? p.content;
    p.imageURL = req.body.imageURL ?? p.imageURL;
    await p.save();

    res.json(p);
  } catch (e) {
    res.status(500).json({ message: "server error" });
  }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    const p = await Post.findById(req.params.id);
    if(!p) return res.status(404).json({ message: "not found" });
    if(p.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "not owner" });

    await p.deleteOne();
    res.json({ message: "deleted" });
  } catch (e) {
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
