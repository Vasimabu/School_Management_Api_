const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');

router.post('/addSchool', schoolController.addSchool);
router.get('/listSchools', schoolController.listSchools);
router.get('/ping', (req, res) => {
    res.send('pong');
  });
  

module.exports = router;
