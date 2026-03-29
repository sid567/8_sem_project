const express    = require('express');
const { getSession, completeSession } = require('../controllers/interview.controller');

const router = express.Router({ mergeParams: true });

// GET  /api/session/:id          — fetch session details
router.get('/:id', getSession);

// POST /api/session/:id/complete — mark session as completed
router.post('/:id/complete', completeSession);

module.exports = router;
