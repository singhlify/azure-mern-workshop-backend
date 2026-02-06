const express = require('express');
const router = express.Router();

/**
 * Health check endpoint
 * GET /health
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is healthy!',
  });
});

module.exports = router;
