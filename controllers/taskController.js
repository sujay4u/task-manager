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

//Update
exports.updateTask =(req, res) =>
{   
    const {id} = req.params;
    const sql = 'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?';
    const {title,description,status} = req.body;

    db.query(sql, [title, description, status, id] ,(err, result)=>
    {
        if(err) return res.status(500).json({error:err.message});
        if(result.affectedRows === 0) return res.status(404).json({error:'Task not found'});

        res.status(200).json({message:'Task Updated', updatedId: id })
    })
}