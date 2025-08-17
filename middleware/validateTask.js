const {body, param} = require('express-validator');

exports.validateTask =[
    body('title').trim().notEmpty().withMessage('Title is required').isLength({min:3}).withMessage('Title must be at least 3 characters long'),

    body('description').optional().isLength({max:255}).withMessage('Description can be max 255 characters'),

    (req, res, next)=>{
        const { validationResult} = require('express-validator');
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        next();
    }
];

exports.validateTaskId =[
    param('id').isInt({min:1}).withMessage('Invalid Task ID'),

    (req,res, next) =>{
        const {validationResult} = require('express-validator');
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            });
        }
        next();
    }
]