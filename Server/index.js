require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());




// import router
const usersRouter = require('./routes/users');


// ใช้งาน router
app.use('/api/users', usersRouter);




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
