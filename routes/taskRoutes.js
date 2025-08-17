const express = require('express');
const router = express.Router();

const { createTask, updateTask, deleteTask } = require('../controllers/taskController');

//Routes
router.post('/', createTask); //create task


router.put('/:id', updateTask); //update task
router.delete('/:id', deleteTask) //delete task

module.exports = router;
