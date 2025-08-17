const express = require('express');
const router = express.Router();

const { createTask, updateTask, deleteTask, getTaskById, getAllTasks } = require('../controllers/taskController');

//Routes
router.post('/', createTask); //create task
router.get('/',getAllTasks) //show all tasks


router.put('/:id', updateTask); //update task
router.delete('/:id', deleteTask) //delete task
router.get('/:id',getTaskById) //show specific task

module.exports = router;
