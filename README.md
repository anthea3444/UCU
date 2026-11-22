/ Person 4 - Claims (in-memory version)
const express = require('express');
const router = express.Router();

let claims = [];
let nextId = 1;

// GET /api/claims?reportId=1
router.get('/', (req, res) => {
  const { reportId } = req.query;
  res.json(reportId ? claims.filter(c => c.reportId === Number(reportId)) : claims);
});

// POST /api/claims  { reportId, claimantName, contact, proof }
router.post('/', (req, res) => {
  const { reportId, claimantName, contact, proof } = req.body;

  if (!reportId || !claimantName || !contact) {
    return res.status(400).json({ error: 'reportId, claimantName and contact are required' });
  }

  const claim = {
    id: nextId++,
    reportId: Number(reportId),
    claimantName,
    contact,
    proof: proof || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  claims.push(claim);
  res.status(201).json({ msg: 'claim sent', claim });
});

// PATCH /api/claims/:id  { status: 'approved' | 'rejected' }
router.patch('/:id', (req, res) => {
  const claim = claims.find(c => c.id === Number(req.params.id));
  if (!claim) return res.status(404).json({ error: 'Claim not found' });

  if (!['approved', 'rejected'].includes(req.body.status)) {
    return res.status(400).json({ error: 'status must be approved or rejected' });
  }
  claim.status = req.body.status;
  res.json({ msg: 'claim updated', claim });
});

module.exports = router;
