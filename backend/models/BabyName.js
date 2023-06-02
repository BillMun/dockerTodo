const mongoose = require('mongoose')


const babyNameSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
    },
    heights:[
        {
            height: {
            type: Number,
            },
    date:{
        type:Date,
        default: Date.now
    }
    },]
})

const BabyName = mongoose.model("BabyName", babyNameSchema)

module.exports = {BabyName}