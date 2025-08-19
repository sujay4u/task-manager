const express = require('express');
const router = express.Router();

const { createTask, updateTask, deleteTask, getTaskById, getAllTasks } = require('../controllers/taskController');
const {validateTask, validateTaskId} = require('../middleware/validateTask');
const authMiddleware = require('../middleware/authMiddleware');


router.use(authMiddleware);


//Routes
router.post('/',validateTask, createTask); //create task
router.get('/',getAllTasks) //show all tasks

router.put('/:id', validateTaskId, validateTask, updateTask); //update task
router.delete('/:id', validateTaskId, deleteTask) //delete task
router.get('/:id', validateTaskId, getTaskById) //show specific task

module.exports = router;
