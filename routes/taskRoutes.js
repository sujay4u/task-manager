const express = require('express');
const router = express.Router();

const { createTask } = require('../controllers/taskController');

//Routes
router.post('/', createTask);

module.exports = router;
