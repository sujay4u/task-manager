require('dotenv').config();
const express = require('express');
const db = require('./config/db');

const app = express();

app.get('/',(req, res)=>{
    res.send('hellow world');
})

app.get('/db-test',(req,res)=>{
    db.query('SELECT 1+1 AS result',(err, results)=>{
        if(err)
            return res.status(500).json({
        error:err.message
        })
        res.json({ dbResult:results[0].result})
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

