// user.routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/', controller.getAllDataByType);
router.get('/cantidad', controller.getCountByType);
router.get('/:id', controller.getItemById);
router.post('/', controller.createData);
router.put('/:id', controller.updateData);
router.delete('/:id', controller.deleteData);

module.exports = router;