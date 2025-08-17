const db=require('../config/db');


//Create
exports.createTask = (req,res) =>{
    const {title, description} = req.body;
    if(!title) return res.status(400).json({error:'Title is required'});

    const sql = 'INSERT INTO tasks (title, description) VALUES (?,?)';
    db.query(sql, [title,description || null], (err,result)=>{
        if(err) return res.status(500).json({error:err.message});
        res.status(201).json({message:'Task created', taskId: result.insertId});
    });
};