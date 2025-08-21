require("dotenv").config();
const express = require("express");
const db = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const  authRoutes = require('./routes/authRoutes');
const cors = require("cors");


const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hellow world");
});

app.get("/db-test", (req, res) => {
  db.query("SELECT 1+1 AS result", (err, results) => {
    if (err)
      return res.status(500).json({
        error: err.message,
      });
    res.json({ dbResult: results[0].result });
  });
});

app.use('/api/auth', authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});