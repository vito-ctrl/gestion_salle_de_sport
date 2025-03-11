const express = require ('express');
const mongoose = require('mongoose');
const cors = require('cors')
const authRouter = require('./routers/authRoute')
const app = express();

// middlewer
app.use(cors());
app.use(express.json());

//route
app.use('/api/auth',authRouter);

//mongodb connection
mongoose.connect('mongodb://127.0.0.1:27017/salle-de-sport')
.then(()=> console.log('connected to mongodb!'))
.catch((error) => console.error('failed to connect to mongodb', error));

//global error handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
    });
})

//server
const port = 3000;
app.listen(port, () => {
    console.log(`app running on ${port}`)
})