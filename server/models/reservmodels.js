const mongoose = require ('mongoose');

const revervSchema = new mongoose.Schema({
    fName:{
        type: String,
        require: true
    },
    lName:{
        type: String,
        require: true
    },
    guest:{
        type: Number,
        require: true
    },
    date:{
        type: String,
    }
})

const reserv = mongoose.model('reservation', revervSchema);
module.exports = reserv;