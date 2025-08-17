const express = require('express');
const router = express.Router();

const { createTask, updateTask } = require('../controllers/taskController');

//Routes
router.post('/', createTask); //create task


router.put('/:id', updateTask); //update task

module.exports = router;
