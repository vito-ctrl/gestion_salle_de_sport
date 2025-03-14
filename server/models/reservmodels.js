const mongoose = require ('mongoose');

const revervSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    startTime:{
        type: String,
        require: true
    },
    endTime:{
        type: String,
        require: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventTheme: {
        type: String,
        default: 'blue'
    }
})

const reserv = mongoose.model('reservation', revervSchema);
module.exports = reserv;