const taskController = require('./taskController');
const authController = require('./authController');

module.exports ={
    ...taskController,
    ...authController,
}