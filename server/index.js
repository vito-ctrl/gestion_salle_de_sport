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
const authr = require('./models/authmodels')
const reserv = require('./models/reservmodels')
app.use(cors())
app.get('/api/auth/role', async(req, res) => {
    try{
        const role = await authr.find();
        res.status(200).json(role)
    }catch (error) {
        console.log(error);
        res.status(500)
    }
})
app.post('/api/reservation', async(req,res) => {
    try {
        const reservationData = {
            title: req.body.title,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            eventTheme: req.body.eventTheme,
            eventDate: new Date(req.body.eventDate)
        }
        const reservation = new reserv(reservationData);
        const result = await reservation.save();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message});
    }
});

app.get('/api/reservation/user', async(req, res) => {
    try {
        const rev = await reserv.find();
        res.status(200).json(rev);
    }catch (error) {
        console.log(error);
        res.status(500)
    }
})

//server
const port = 3000;
app.listen(port, () => {
    console.log(`app running on ${port}`)
})