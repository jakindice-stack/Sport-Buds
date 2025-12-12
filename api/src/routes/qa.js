const express = require('express');
const router = express.Router();
const qaController = require('../controllers/qa');

router.get('/test-records', qaController.listTestRecords);
router.post('/test-records', qaController.createTestRecord);
router.patch('/test-records/:id', qaController.updateTestRecord);
router.delete('/test-records/:id', qaController.deleteTestRecord);

module.exports = router;
